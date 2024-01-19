"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal-store";
import { ChangeCostSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import qs from 'query-string';
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";

export const ChangeCostModal = () => {
  const { isOpen, type, data, onClose } = useModal();
  const [isPending, startTranistion] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { admissionFee, membershipPlanCost } = data;
  const form = useForm<z.infer<typeof ChangeCostSchema>>({
    resolver: zodResolver(ChangeCostSchema),
    defaultValues: {
      membershipPlanCost: admissionFee,
      admissionFee: membershipPlanCost,
    },
  });

  useEffect(() => {
    if (admissionFee) {
      form.setValue("admissionFee", admissionFee);
    }
  }, [form, admissionFee]);

  const onSubmit = (values: z.infer<typeof ChangeCostSchema>) => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        modified_plan_cost: values.membershipPlanCost,
        modified_admission_fee: values.admissionFee,
      }
    }, {skipEmptyString: true, skipNull: true})

    router.push(url);
    onClose();
  };

  return (
    <Dialog
      open={isOpen && type === "CHANGE_COST_MODAL"}
      onOpenChange={() => onClose()}
    >
      <DialogContent className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="membershipPlanCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Plan Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Membership Plan Cost"
                      isPending={isPending}
                      autoFocus
                      value={field.value!}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admissionFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Fee</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Admission Fee"
                      isPending={isPending}
                      autoFocus
                      value={field.value!}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="ml-auto" disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
