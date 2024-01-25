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
import qs from "query-string";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { RefreshCcw } from "lucide-react";
import { useCostStore } from "@/hooks/use-cost-store";

export const ChangeCostModal = () => {
  const { isOpen, type, data, onClose } = useModal();
  const router = useRouter();
  const { cost, setCost } = useCostStore();
  const pathname = usePathname();
  const { totalCost } = data;
  const form = useForm<z.infer<typeof ChangeCostSchema>>({
    resolver: zodResolver(ChangeCostSchema),
    defaultValues: {
      modifiedCost: 0,
    },
  });

  useEffect(() => {
    form.setValue("modifiedCost", (cost as number) || (totalCost as number));
  }, [form, totalCost, cost]);

  const onSubmit = (values: z.infer<typeof ChangeCostSchema>) => {
    setCost(values.modifiedCost as number);
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
              name="modifiedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Modified Total Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Membership Plan Cost"
                      autoFocus
                      value={field.value!}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 justify-between">
              <Button
                onClick={() => {
                  setCost(undefined);
                  onClose();
                }}
                type="button"
                variant="destructive"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button>Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
