"use client";

import { Benefit } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MembershipBenefitForm } from "../forms/membership-benefit-form";
import { Button } from "../ui/button";
import { useState } from "react";
import { ActionDropdownMenu } from "../action-dropdown-menu";
import { EditIcon, TableProperties, TrashIcon } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface MembershipBenefitsProps {
  benefits: Benefit[];
}

export const MembershipBenefits = ({ benefits }: MembershipBenefitsProps) => {
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState("");
  const { onOpen } = useModal();
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline bg-background hover:bg-background/80 cursor-pointer px-3 rounded-xl">
          <div className="flex items-center gap-3">
            <TableProperties className="h-5 w-5" />
            Membership Plan Benefits
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3">
          <ul className="grid lg:grid-cols-2">
            {benefits.map((item, index) => (
              <li
                key={item.id}
                className="relative flex flex-col hover:bg-accent font-semibold transition py-2 px-3 rounded-md"
              >
                <div className="flex items-center justify-between">
                  {index + 1}. {item.title}
                  <ActionDropdownMenu
                    items={[
                      {
                        label: "Edit",
                        icon: EditIcon,
                        onClick: () => {
                          setOpenForm(true);
                          setEditingId(item.id);
                        },
                      },
                      {
                        label: "Delete",
                        icon: TrashIcon,
                        onClick: () =>
                          onOpen("DELETE_BENEFIT_MODAL", { benefit: item }),
                        isDestructive: true,
                      },
                    ]}
                  />
                </div>
                {editingId === item.id && (
                  <MembershipBenefitForm
                    onChange={() => {
                      setOpenForm(false);
                      setEditingId("");
                    }}
                    benefit={item}
                  />
                )}
              </li>
            ))}
          </ul>
          {!editingId && (
            <>
              {openForm ? (
                <MembershipBenefitForm
                  onChange={() => {
                    setOpenForm(false);
                  }}
                />
              ) : (
                <Button
                  onClick={() => setOpenForm(true)}
                  className="ml-auto mr-3"
                >
                  Add new
                </Button>
              )}
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
