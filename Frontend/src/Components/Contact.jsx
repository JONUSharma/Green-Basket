import { useState } from "react";
import { Mail, Phone, MapPin, Send, User } from "lucide-react";

export default function ContactForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [result, setResult] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.subject || !form.message) {
            return alert("Please fill all *required fields!");
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("subject", form.subject);
        formData.append("message", form.message);
        formData.append("access_key", "42a0bed0-761e-4b89-975d-42d6e1764cc4");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully...");
        } else {
            console.log("Error", data);
            setResult(data.message);
        }

        // reset form
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    };


    return (
        <section className="bg-gradient-to-br from-green-50 via-white to-green-100 py-14 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

                {/* Left Info Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-green-100">
                    <h2 className="text-3xl font-bold text-green-700">Get in Touch</h2>
                    <p className="text-gray-600">
                        Feel free to reach out to us. We appreciate your feedback and questions!
                    </p>

                    <div className="space-y-4 text-gray-700">
                        <div className="flex gap-3 items-center">
                            <Mail className="text-green-600" />
                            <p>support@greenbasket.com</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Phone className="text-green-600" />
                            <p>+91 ***** ****</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <MapPin className="text-green-600" />
                            <p>Green Market Complex, BTKIT Dwarahat - 263653</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-lg p-8 space-y-5 border border-green-100"
                >
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">Full Name *</label>
                        <div className="flex items-center gap-2 border rounded-lg p-2">
                            <User className="text-green-600" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">Email *</label>
                        <div className="flex items-center gap-2 border rounded-lg p-2">
                            <Mail className="text-green-600" />
                            <input
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">Phone (Optional)</label>
                        <div className="flex items-center gap-2 border rounded-lg p-2">
                            <Phone className="text-green-600" />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">Subject *</label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="How can we help you?"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">Message *</label>
                        <textarea
                            name="message"
                            placeholder="Write your message here..."
                            value={form.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border rounded-lg p-2 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 transition flex items-center justify-center gap-2 py-3 text-white font-medium rounded-lg"
                    >
                        <Send size={18} /> Send Message
                    </button>
                    <div className="flex items-center justify-center">
                    <span className=" text-green-600 text-center font-semibold ">Thanks! {result}</span>
                    </div>
                </form>
            </div>
        </section>
    );
}
