"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  createMembershipPlan,
  updateMembershipPlan,
} from "@/actions/membership-plans-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MembershipPlanSchema } from "@/schemas";
import { motion } from "framer-motion";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { CardWrapper } from "../card-wrapper";
import { Benefit } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { FullMembershipPlan } from "@/types";
import { useRouter } from "next/navigation";

interface MembershipPlanFormProps {
  membershipBenefits: Benefit[];
  membershipPlan?: FullMembershipPlan;
}

export const MembershipPlanForm = ({
  membershipBenefits,
  membershipPlan,
}: MembershipPlanFormProps) => {
  const [isPending, startTranistion] = useTransition();
  const router = useRouter();
  const FramerButton = motion(Button);
  const form = useForm<z.infer<typeof MembershipPlanSchema>>({
    resolver: zodResolver(MembershipPlanSchema),
    defaultValues: {
      name: membershipPlan?.name || "",
      durationInMonth: membershipPlan?.durationInMonth || undefined,
      price: membershipPlan?.price || undefined,
      benefitIds: membershipPlan?.benefitIds || [],
    },
  });

  const benefitIds = form.getValues("benefitIds");

  const handleCheck = (id: string) => {
    const isChecked = benefitIds.includes(id);
    if (isChecked) {
      const updatedIds = benefitIds.filter((item) => item !== id);
      form.setValue("benefitIds", updatedIds, { shouldValidate: true });
    } else {
      form.setValue("benefitIds", [...benefitIds, id], {
        shouldValidate: true,
      });
    }
  };


  function onSubmit(values: z.infer<typeof MembershipPlanSchema>) {
    startTranistion(() => {
      if (membershipPlan) {
        updateMembershipPlan({
          values,
          membershipPlanId: membershipPlan.id,
        }).then(({ success, error }) => {
          if (success) {
            toast.success(success);
            router.push("/admin/membership-plans");
            router.refresh();
          } else if (error) {
            toast.error(error);
          }
        });
      } else {
        createMembershipPlan(values).then(({ success, error }) => {
          if (success) {
            toast.success(success);
            router.push("/admin/membership-plans");
            router.refresh();
          } else if (error) {
            toast.error(error);
          }
        });
      }
    });
  }
  return (
    <CardWrapper title="Create a new Memberhip Plan">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Basic Plan, Standard Plan etc"
                    isPending={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationInMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration in Month</FormLabel>
                <FormControl>
                  <Input
                    isPending={isPending}
                    placeholder="Enter Membership Duration"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    isPending={isPending}
                    placeholder="Enter Membership Price"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="benefitIds"
            render={() => (
              <FormItem>
                <FormLabel>Facilities</FormLabel>
                <FormControl>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {membershipBenefits.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center py-2 space-x-2"
                      >
                        <Checkbox
                          id={item.id}
                          checked={benefitIds.includes(item.id)}
                          onClick={() => handleCheck(item.id)}
                        />
                        <label
                          htmlFor={item.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FramerButton
            whileTap={{ scale: 1.05 }}
            disabled={isPending}
            className="ml-auto"
          >
            {membershipPlan ? "Save" : "Create"}
          </FramerButton>
        </form>
      </Form>
    </CardWrapper>
  );
};
