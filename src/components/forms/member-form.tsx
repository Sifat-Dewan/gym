"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createMember, updateMember } from "@/actions/members-action";
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
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useModal } from "@/hooks/use-modal-store";
import { MemberSchema } from "@/schemas";
import { FullMembershipPlan, MemberWithPlan } from "@/types";
import { Gender, MembershipPlan } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { CardWrapper } from "../card-wrapper";
import { DatePicker } from "../date-picker";
import { ImageUpload } from "../image-upload";
import { MembershipPlanPicker } from "../membership-plan-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

export const MemberForm = ({
  membershipPlans,
  selectedPlan,
  member,
  admissionFee,
  isModerator,
}: {
  membershipPlans: FullMembershipPlan[];
  selectedPlan: MembershipPlan;
  member?: MemberWithPlan;
  admissionFee: number;
  isModerator?: boolean;
}) => {
  const [isPending, startTranistion] = useTransition();
  const { onOpen } = useModal();
  const params = useSearchParams();
  const router = useRouter();
  const confetti = useConfettiStore();
  const { onClose } = useModal();
  const FramerButton = motion(Button);
  const form = useForm<z.infer<typeof MemberSchema>>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      name: member?.name || "",
      phone: member?.phone || "",
      memberId: member?.memberId || "",
      email: (member?.email as string) || "",
      address: member?.address || "",
      age: member?.age || undefined,
      gender: member?.gender || undefined,
      image: (member?.image as string) || "",
      startDate: member?.startDate || undefined,
    },
  });

  const pronoun = isModerator ? "Member's" : "Your";
  const totalCost = selectedPlan.price + admissionFee;
  const modifiedCost = params.get("modified_cost");

  const cost = modifiedCost ? Number(modifiedCost) : totalCost;

  function onSubmit(values: z.infer<typeof MemberSchema>) {
    startTranistion(() => {
      if (member) {
        updateMember({ values, memberId: member.id }).then(
          ({ error, success }) => {
            if (success) {
              toast.success(success);
              onClose();
              router.push("/admin/members");
              router.refresh();
              confetti.onOpen();
            } else if (error) {
              toast.error(error);
            } else {
              toast.error("Something went wrong");
            }
          }
        );
      } else if (selectedPlan) {
        createMember({
          values,
          membershipPlanId: selectedPlan.id,
          cost,
        }).then(({ error, success }) => {
          if (success) {
            toast.success(success);
            router.push(
              isModerator ? "/admin/members" : `/admission?success=true`
            );
            router.refresh();
            confetti.onOpen();
          } else if (error) {
            toast.error(error);
          } else {
            toast.error("Something went wrong");
          }
        });
      }
    });
  }

  return (
    <CardWrapper>
      {membershipPlans && !member && (
        <MembershipPlanPicker
          membershipPlans={membershipPlans}
          selectedPlan={selectedPlan}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <div className="grid sm:grid-cols-8 gap-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="row-span-2 sm:col-span-3">
                  <FormControl>
                    <ImageUpload
                      pronoun={pronoun}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-5">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${pronoun} Name`}
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
              name="phone"
              render={({ field }) => (
                <FormItem className="sm:col-span-5">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      isPending={isPending}
                      placeholder={`Enter ${pronoun} Phone Number`}
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isModerator && (
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem className="sm:col-span-5">
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${pronoun} Id`}
                      isPending={isPending}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address (optional)</FormLabel>
                <FormControl>
                  <Input
                    isPending={isPending}
                    placeholder={`Enter ${pronoun} Address`}
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isModerator && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input
                      isPending={isPending}
                      placeholder={`Enter ${pronoun} Email`}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (optional)</FormLabel>
                <FormControl>
                  <Input
                    isPending={isPending}
                    placeholder={`Enter ${pronoun} Age`}
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    disabled={isPending}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(Gender).map((gender) => (
                          <SelectItem
                            key={gender}
                            value={gender}
                            onChange={field.onChange}
                            className="capitalize"
                          >
                            {gender.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!member && (
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex items-center justify-between">
            {!member && (
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground font-semibold">
                  Membership Cost:{" "}
                  <span className="text-primary">{selectedPlan.price}৳</span>
                </p>
                <p className="text-muted-foreground font-semibold">
                  Admission Fee:{" "}
                  <span className="text-primary">{admissionFee}৳</span>
                </p>
                <Separator className="h-[1.5px]" />
                <p
                  onClick={() =>
                    isModerator &&
                    onOpen("CHANGE_COST_MODAL", {
                      totalCost: cost,
                    })
                  }
                  className="text-muted-foreground select-none font-semibold flex gap-2"
                >
                  Total:{" "}
                  <span className="text-primary flex gap-2">
                    <span
                      className={cn(
                        modifiedCost && "line-through text-muted-foreground"
                      )}
                    >
                      {totalCost}৳
                    </span>
                    {modifiedCost && <span>{modifiedCost}৳</span>}
                  </span>
                </p>
              </div>
            )}
            <FramerButton
              disabled={isPending}
              whileTap={{ scale: 1.05 }}
              className="ml-auto"
            >
              {member ? "Update" : "Create"}
            </FramerButton>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
