"use client"

import * as React from "react"

import {
  Dialog as BaseDialog,
  DialogTrigger as BaseDialogTrigger,
  DialogPortal as BaseDialogPortal,
  DialogOverlay as BaseDialogOverlay,
  DialogContent as BaseDialogContent,
  DialogHeader as BaseDialogHeader,
  DialogFooter as BaseDialogFooter,
  DialogTitle as BaseDialogTitle,
  DialogDescription as BaseDialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = BaseDialog
const AlertDialogTrigger = BaseDialogTrigger
const AlertDialogPortal = BaseDialogPortal
const AlertDialogOverlay = BaseDialogOverlay
const AlertDialogContent = BaseDialogContent
const AlertDialogHeader = BaseDialogHeader
const AlertDialogFooter = BaseDialogFooter
const AlertDialogTitle = BaseDialogTitle
const AlertDialogDescription = BaseDialogDescription

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <DialogClose asChild>
    <button
      ref={ref}
      className={cn(buttonVariants(), className)}
      {...props}
    />
  </DialogClose>
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <DialogClose asChild>
    <button
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  </DialogClose>
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
