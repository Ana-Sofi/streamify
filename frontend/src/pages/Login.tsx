import { useForm, type SubmitHandler } from "react-hook-form";
import { streamifyClient } from "../api/streamify-client";
import type { Credentials } from "../model/streamify.model";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
  const { register, handleSubmit } = useForm<Credentials>();
  const onSubmit: SubmitHandler<Credentials> = async (data) => {
    await streamifyClient.authenticate(data);
    const profile = await streamifyClient.getCurrentUser();

    console.log(profile);
  };

  return (<></>);
}
