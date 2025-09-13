"use client";

import InputNumber from "rc-input-number";
import { Icon } from "@iconify/react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

interface ControlledNumberInputProps<T extends FieldValues, N extends Path<T>> {
  id: string;
  className: string;
  field: ControllerRenderProps<T, N>;
  min: number;
  max: number;
  step: number;
}

export default function ControlledNumberInput<T extends FieldValues, N extends Path<T>>({
  id,
  className,
  field,
  min,
  max,
  step,
}: ControlledNumberInputProps<T, N>) {
  const upHandler = (
    <button
      type="button"
      className="p-3 bg-white rounded-r-xl hover:bg-slate-50 border-l border-slate-200 absolute right-0 top-0 h-full"
    >
      <Icon icon="iconoir:plus" />
    </button>
  );

  const downHandler = (
    <button
      type="button"
      className="p-3 bg-white rounded-l-xl hover:bg-slate-50 border-r border-slate-200 absolute left-0 top-0 h-full"
    >
      <Icon icon="iconoir:minus" />
    </button>
  );

  return (
    <InputNumber
      id={id}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      name={field.name}
      ref={field.ref}
      className={`${className} relative px-12`}
      min={min}
      max={max}
      step={step}
      upHandler={upHandler}
      downHandler={downHandler}
    />
  );
}
