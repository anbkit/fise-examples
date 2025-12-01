import { useState } from "react";
import { fiseEncrypt, fiseDecrypt } from "fise";
import { getRulesForDemo, RULES_METADATA } from "@fise-examples/shared";
import { API_BASE } from "../../config.ts";

export default function FormDemo({ loading, setLoading, setError, setResult }) {
    const [formName, setFormName] = useState("John Doe");
    const [formEmail, setFormEmail] = useState("john@example.com");
    const [formMessage, setFormMessage] = useState("Hello from FISE!");

    // Helper to get current timestamp
    const getTimestamp = () => Math.floor(Date.now() / 60000);

    // Submit form
    const handleFormSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = {
                name: formName,
                email: formEmail,
                message: formMessage,
            };

            // Encrypt form data before sending using form rules
            const encrypted = fiseEncrypt(
                JSON.stringify(formData),
                getRulesForDemo("form"),
                { timestamp: getTimestamp() }
            );

            const response = await fetch(`${API_BASE}/api/submit-form`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: encrypted }),
            });

            if (!response.ok) {
                throw new Error("Form submission failed");
            }

            const { data } = await response.json();

            // Decrypt the response using form rules
            const plaintext = fiseDecrypt(
                data,
                getRulesForDemo("form"),
                {
                    timestamp: getTimestamp(),
                }
            );
            const confirmation = JSON.parse(plaintext);

            setResult({
                encrypted: {
                    sent: encrypted,
                    received: data,
                },
                decrypted: {
                    sent: formData,
                    received: confirmation,
                },
                success: true,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[400px]">
            <h2 className="mb-2 text-3xl text-dark">Submit Encrypted Form</h2>
            <p className="text-gray mb-6 leading-relaxed">
                POST encrypted form data to{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">/api/submit-form</code> - Server decrypts
                and processes
            </p>
            <div className="flex gap-2 mb-4 flex-wrap">
                <span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-primaryLight text-primaryDark">
                    Rules: {RULES_METADATA["form"].name}
                </span>
            </div>
            <div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mb-6">
                <strong className="text-infoDark">💡 How it works:</strong>
                <ul className="mt-2 mb-0 pl-5 list-disc space-y-1 text-sm text-dark">
                    <li>Form data is encrypted client-side before submission</li>
                    <li>Server receives encrypted data and decrypts it</li>
                    <li>Server processes the form and encrypts the response</li>
                    <li>Client decrypts the confirmation message</li>
                </ul>
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-semibold text-dark">Name:</label>
                <input
                    type="text"
                    className="w-full px-3 py-3 border-2 border-border rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-primary"
                    value={formName}
                    onChange={(e) =>
                        setFormName(e.target.value)
                    }
                />
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-semibold text-dark">Email:</label>
                <input
                    type="email"
                    className="w-full px-3 py-3 border-2 border-border rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-primary"
                    value={formEmail}
                    onChange={(e) =>
                        setFormEmail(e.target.value)
                    }
                />
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-semibold text-dark">Message:</label>
                <textarea
                    className="w-full px-3 py-3 border-2 border-border rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-primary min-h-[120px] resize-y font-mono"
                    value={formMessage}
                    onChange={(e) =>
                        setFormMessage(e.target.value)
                    }
                    rows="4"
                />
            </div>

            <button
                className="inline-block px-6 py-3 rounded-lg font-semibold text-base border-none cursor-pointer bg-primary text-white active:opacity-[0.8] md:w-full md:text-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleFormSubmit}
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit Form"}
            </button>
        </div>
    );
}

