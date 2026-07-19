"use client";

import { DayPicker } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";
import "react-day-picker/style.css";
import "./calendar.css";

// 受控版本：選到的日期、紅綠點資料都由外面(AccountingApp)傳進來
export default function BudgetCalendar({
  selected,
  onSelect,
  spendDays = [],
  incomeDays = [],
  month,
  onMonthChange,
}: {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  spendDays?: Date[];
  incomeDays?: Date[];
  month?: Date;
  onMonthChange?: (m: Date) => void;
}) {
  // 自己控制顯示哪個月，箭頭才能換月
  return (
    <DayPicker
      mode="single"
      locale={zhTW}
      selected={selected}
      onSelect={onSelect}
      month={month}
      onMonthChange={onMonthChange}
      showOutsideDays
      modifiers={{ spend: spendDays, income: incomeDays }}
      modifiersClassNames={{ spend: "day-spend", income: "day-income" }}
    />
  );
}