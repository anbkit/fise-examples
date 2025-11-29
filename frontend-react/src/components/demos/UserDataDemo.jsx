import { useState } from "react";
import { decryptFise, xorCipher } from "fise";
import { getRulesForDemo, RULES_METADATA } from "@fise-examples/shared";
import { API_BASE } from "../../config.ts";

export default function UserDataDemo({ loading, setLoading, setError, setResult }) {
	const [userId, setUserId] = useState("123");

	// Helper to get current timestamp
	const getTimestamp = () => Math.floor(Date.now() / 60000);

	// Fetch and decrypt user data
	const fetchUserData = async () => {
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const response = await fetch(`${API_BASE}/api/user/${userId}`);
			const { data } = await response.json();

			// Decrypt the response using user-data rules
			const plaintext = decryptFise(
				data,
				xorCipher,
				getRulesForDemo("user-data"),
				{
					timestamp: getTimestamp(),
				}
			);
			const userData = JSON.parse(plaintext);

			setResult({
				encrypted: data,
				decrypted: userData,
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
			<h2 className="mb-2 text-3xl text-dark">Fetch User Data</h2>
			<p className="text-gray mb-6 leading-relaxed">
				GET request to <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">/api/user/:id</code> -
				Returns encrypted user data
			</p>
			<div className="flex gap-2 mb-4 flex-wrap">
				<span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-primaryLight text-primaryDark">
					Rules: {RULES_METADATA["user-data"].name}
				</span>
			</div>
			<div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mb-6">
				<strong className="text-infoDark">💡 How it works:</strong>
				<ul className="mt-2 mb-0 pl-5 list-disc space-y-1 text-sm text-dark">
					<li>Server encrypts user data using FISE rules</li>
					<li>Client receives encrypted envelope</li>
					<li>Client decrypts using the same rules and timestamp</li>
					<li>Decrypted data is displayed below</li>
				</ul>
			</div>

			<div className="mb-6">
				<label className="block mb-2 font-semibold text-dark">User ID:</label>
				<input
					type="text"
					className="w-full px-3 py-3 border-2 border-border rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-primary"
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
					placeholder="123"
				/>
			</div>

			<button
				className="inline-block px-6 py-3 rounded-lg font-semibold text-base border-none cursor-pointer bg-primary text-white active:opacity-[0.8] md:w-full md:text-center disabled:opacity-50 disabled:cursor-not-allowed"
				onClick={fetchUserData}
				disabled={loading}
			>
				{loading ? "Fetching..." : "Fetch User Data"}
			</button>
		</div>
	);
}

