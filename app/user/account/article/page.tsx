"use client";
import Container from "../../_components/container";
import Link from "next/link";
import Left from "../_components/left";

export default function Account() {
  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left></Left>
      <div className="w-[70%] h-[720px] p-4 overflow-y-auto">
      </div>
    </Container>
  );
}
