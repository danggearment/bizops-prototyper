import { CreatePricingRuleType } from "@/schemas/schemas/pricing"
import {
  Button,
  Calendar,
  cn,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TextareaField,
} from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { CalendarIcon, Pencil } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { PricingRuleDetailMode } from "../../-helper"
import SelectTeam from "./select-team"
import { TimePicker } from "./time-picker/time-picker"
import {
  fromCalendarDate,
  toCalendarDate,
} from "./time-picker/time-picker-utils"

dayjs.extend(utc)

const MAX_CHARACTERS = 500

interface Props {
  teamReadOnly?: boolean
  defaultValue?: {
    label: string
    value: string
  }
  createdBy?: string
  mode?: PricingRuleDetailMode
  customId?: string
}

export default function BasicInformation({
  teamReadOnly,
  defaultValue,
  mode = PricingRuleDetailMode.UPDATE,
  createdBy,
  customId,
}: Props) {
  const form = useFormContext<CreatePricingRuleType>()
  const navigate = useNavigate()

  const internalNote = form.watch("internalNote") ?? ""
  const isMaxError = internalNote.length > MAX_CHARACTERS

  const isDetail = mode === PricingRuleDetailMode.DETAIL

  const handleEdit = () => {
    if (!customId) return
    navigate({
      to: "/global-configuration/pricing-management/$customId",
      params: { customId },
      search: { mode: PricingRuleDetailMode.UPDATE },
    })
  }

  return (
    <div className="bg-white dark:bg-dark-2 p-6 rounded-xl space-y-4">
      <div className="heading-3 flex items-center justify-between">
        Basic information{" "}
        <Button
          size="sm"
          onClick={handleEdit}
          className={cn(!isDetail && "hidden")}
        >
          <Pencil /> Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel required>Assigned team</FormLabel>
                  <div className="w-[160px]">
                    <p className="text-sm leading-[12px]">
                      Team ID:{" "}
                      <span className="font-bold">{field.value ?? "--"}</span>
                    </p>
                  </div>
                </div>
                <FormControl>
                  <SelectTeam
                    {...field}
                    disabled={teamReadOnly || isDetail}
                    defaultValue={defaultValue}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1">
          <FormField
            control={form.control}
            name="dateRange.from"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel required>Start date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={isDetail}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        dayjs(field.value as Date)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss [UTC]")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toCalendarDate(field.value as Date)}
                      onSelect={(date) => {
                        const next = fromCalendarDate(
                          date ?? undefined,
                          field.value as Date | undefined,
                        )
                        field.onChange(next)
                      }}
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker
                        setDate={(date) => {
                          field.onChange(date ?? undefined)
                        }}
                        date={field.value}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1">
          <FormField
            control={form.control}
            name="dateRange.to"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel required>End date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={isDetail}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        dayjs(field.value as Date)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss [UTC]")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toCalendarDate(field.value as Date)}
                      onSelect={(date) => {
                        const next = fromCalendarDate(
                          date ?? undefined,
                          field.value as Date | undefined,
                        )
                        field.onChange(next)
                      }}
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker
                        setDate={(date) => {
                          field.onChange(date ?? undefined)
                        }}
                        date={field.value}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={cn("col-span-2", !isDetail && "hidden")}>
          <FormItem>
            <FormLabel>Created by</FormLabel>
            <FormControl>
              <InputField value={createdBy} disabled={isDetail} />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="internalNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internal note</FormLabel>
                <FormControl>
                  <TextareaField
                    placeholder="Add internal note (optional, max 500 characters) "
                    {...field}
                    className={cn(
                      isMaxError && "border-red-500",
                      isDetail && "disabled:opacity-50",
                    )}
                    rows={4}
                    disabled={isDetail}
                  />
                </FormControl>
                <FormMessage />
                <div
                  className={`${isMaxError ? "text-red-500" : "text-gray-500"}`}
                >
                  {internalNote.length}/{MAX_CHARACTERS}
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
