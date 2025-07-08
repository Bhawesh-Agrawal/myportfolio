"use client";
import React, { useState, ChangeEvent } from "react";
import {
    Mail,
    MessageCircle,
    MapPin,
    Send,
    User,
    AtSign,
    MessageSquare,
    Instagram,
    Linkedin,
    Twitter,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState("");

    const createMessage = useMutation(api.createMessage.createMessage);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert("Please fill in all the fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to Convex DB
            await createMessage({ ...formData });

            // Send email via your API route
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                alert("Message saved but email failed to send.");
            } else {
                alert("Message sent successfully!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            }

        } catch (err) {
            console.error("Submission error:", err);
            alert("Something went wrong. Try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Mail className="w-5 h-5" />,
            label: "Email Address",
            value: "owner@bhaweshagrawal.com.np",
            link: "mailto:owner@bhaweshagrawal.com.np",
        },
        {
            icon: <MessageCircle className="w-5 h-5" />,
            label: "WhatsApp",
            value: "+977 981 315 5015",
            link: "https://wa.me/9779813155015",
        },
        {
            icon: <MapPin className="w-5 h-5" />,
            label: "Location",
            value: "Remote / Kathmandu, Nepal",
            link: null,
        },
    ];

    const inputFields = [
        {
            name: "name",
            placeholder: "Your Name",
            icon: <User className="w-4 h-4" />,
            type: "text",
        },
        {
            name: "email",
            placeholder: "Email Address",
            icon: <AtSign className="w-4 h-4" />,
            type: "email",
        },
        {
            name: "subject",
            placeholder: "Subject",
            icon: <MessageSquare className="w-4 h-4" />,
            type: "text",
        },
    ];

    const socialLinks = [
        {
            icon: <Instagram className="w-5 h-5" />,
            label: "Instagram",
            url: "https://instagram.com/bhaweshagrawal",
            color: "#bb4d00",
        },
        {
            icon: <Linkedin className="w-5 h-5" />,
            label: "LinkedIn",
            url: "https://linkedin.com/in/bhaweshagrawal",
            color: "#6096b4",
        },
        {
            icon: <Twitter className="w-5 h-5" />,
            label: "Twitter",
            url: "https://twitter.com/bhaweshagrawal",
            color: "#bdcdd6",
        },
    ];

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                        Let's Keep in{" "}
                        <span className="text-blue-600 underline decoration-4 underline-offset-4">
              Touch
            </span>
                    </h1>
                    <div className="max-w-2xl mx-auto">
                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                            Ready to bring your ideas to life? I'd love to hear from you.
                            Whether you have a project in mind or just want to connect, let's
                            start a conversation that could lead to something amazing.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    {/* Contact Information */}
                    <div className="flex flex-col justify-between bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                                Get in Touch
                            </h2>
                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="group">
                                        {item.link ? (
                                            <a
                                                href={item.link}
                                                target={
                                                    item.link.startsWith("http") ? "_blank" : undefined
                                                }
                                                rel={
                                                    item.link.startsWith("http")
                                                        ? "noopener noreferrer"
                                                        : undefined
                                                }
                                                className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-100 hover:to-orange-50 transition-all duration-300 hover:shadow-md cursor-pointer"
                                            >
                                                <div
                                                    style={{ backgroundColor: "#6096b4" }}
                                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
                                                >
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                                        {item.label}
                                                    </p>
                                                    <p className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 break-words">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50">
                                                <div
                                                    style={{ backgroundColor: "#6096b4" }}
                                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                                >
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                                        {item.label}
                                                    </p>
                                                    <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center lg:text-left">
                                Connect with me
                            </h3>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                    >
                                        <div
                                            style={{ backgroundColor: social.color }}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                        >
                                            {social.icon}
                                        </div>
                                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {social.label}
                    </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 flex flex-col justify-between">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                            Send Message
                        </h2>
                        <div className="space-y-6">
                            {inputFields.map((field) => (
                                <div key={field.name} className="relative">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            {field.icon}
                                        </div>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name as keyof typeof formData]}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField(field.name)}
                                            onBlur={() => setFocusedField("")}
                                            placeholder={field.placeholder}
                                            className={`w-full pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 bg-gray-50 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 ${
                                                focusedField === field.name
                                                    ? "border-blue-500 bg-white shadow-lg"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Message Field */}
                            <div className="relative">
                                <div className="absolute left-3 top-4 text-gray-400">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField("message")}
                                    onBlur={() => setFocusedField("")}
                                    placeholder="Your Message"
                                    rows={4}
                                    className={`w-full pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 bg-gray-50 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 resize-none ${
                                        focusedField === "message"
                                            ? "border-blue-500 bg-white shadow-lg"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-0 ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "shadow-lg hover:shadow-xl"
                                }`}
                                style={{
                                    backgroundColor: isSubmitting ? undefined : "#6096b4",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting) {
                                        (e.target as HTMLElement).style.backgroundColor = "#527a9b";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSubmitting) {
                                        (e.target as HTMLElement).style.backgroundColor = "#6096b4";
                                    }
                                }}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
