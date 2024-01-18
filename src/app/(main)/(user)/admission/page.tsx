import { buttonVariants } from "@/components/ui/button";
import { InstituteName } from "@/lib/constants";
import { currentUser } from "@/lib/current-user";
import db from "@/lib/db";
import { cn, formatMonth } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CancelAdmissionButton } from "./cancel-admission-button";

const SuccessPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const success = searchParams.success === "true";

  const member = await db.member.findFirst({
    where: {
      email: user.email,
      isPaid: false,
    },
    include: {
      membershipPlan: true,
    },
  });

  if (!member || !success) {
    redirect("/dashboard");
  }

  const defaultSettings = await db.defaultSettings.findFirst();

  if (!defaultSettings?.admissionFee) {
    notFound();
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="dark:bg-secondary/50 border rounded-xl p-6 space-y-6 shadow-xl max-w-[500px]">
        <h1 className="font-semibold text-center text-3xl text-green-500">
          Enroll Successful!
        </h1>
        <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
        <p>
          Enrollment successful! To finalize your admission, please visit our
          gym (<span className="text-primary">{InstituteName}</span>) to pay the
          admission and membership fees. Our team is ready to assist you.
          Welcome to our fitness community!
        </p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
          <p className="text-muted-foreground font-medium">Membership Plan</p>
          <p className="font-medium text-end">{member.membershipPlan.name}</p>
          <p className="text-muted-foreground font-medium">Duration</p>
          <p className="font-medium text-end">
            {member.membershipPlan.durationInMonth}{" "}
            {formatMonth(member.membershipPlan.durationInMonth)}
          </p>
          <p className="text-muted-foreground font-medium">Price</p>
          <p className="font-medium text-end">{member.membershipPlan.price}৳</p>
          <p className="text-muted-foreground font-medium">Admission Fee</p>
          <p className="font-medium text-end">
            {defaultSettings?.admissionFee}৳
          </p>
        </div>
        <div className="flex justify-between gap-4 mt-3">
          <CancelAdmissionButton />
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
