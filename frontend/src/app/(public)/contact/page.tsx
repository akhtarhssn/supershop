"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    reset();
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  const contacts = [
    { icon: MapPin, title: "Visit Us", lines: ["123 Green Market Street", "New York, NY 10001"] },
    { icon: Phone, title: "Call Us", lines: ["+1 800 123 4567", "Mon-Sat, 9am-6pm EST"] },
    { icon: Mail, title: "Email Us", lines: ["hello@supershop.com", "support@supershop.com"] },
    { icon: Clock, title: "Working Hours", lines: ["Mon-Saturday: 9am-6pm", "Sunday: 10am-4pm"] },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <section className="hero-gradient py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeading badge="Contact" title="Get In " highlight="Touch" description="Have a question or feedback? We'd love to hear from you." centered />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {contacts.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl border border-[#D1D5DB] p-5 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
                <c.icon className="w-5 h-5 text-[#6366F1]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
              {c.lines.map((line) => (
                <p key={line} className="text-sm text-gray-500">{line}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-7">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Send a Message</h2>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-[#4baf4f] mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-4">We'll get back to you within 24 hours.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="border-[#6366F1] text-[#6366F1]">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Name</Label>
                    <Input {...register("name", { required: true })} placeholder="Your name" className="border-[#D1D5DB]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Email</Label>
                    <Input {...register("email", { required: true })} type="email" placeholder="your@email.com" className="border-[#D1D5DB]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Subject</Label>
                  <Input {...register("subject", { required: true })} placeholder="How can we help?" className="border-[#D1D5DB]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Message</Label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] resize-none"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#6366F1] hover:bg-[#4F46E5] gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-center min-h-80">
            <div className="text-center text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-2 text-[#6366F1]" />
              <p className="font-medium text-gray-600">123 Green Market St</p>
              <p className="text-sm">New York, NY 10001</p>
              <p className="text-xs mt-2 text-gray-400">Interactive map loads via Google Maps API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
