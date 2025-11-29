import { useState, useEffect } from "react";
import { encryptFise, decryptFise, xorCipher } from "fise";
import { getRulesForDemo, RULES_METADATA } from "@fise-examples/shared";
import { API_BASE } from "../../config.ts";

export default function LoginDemo({ loading, setLoading, setError, setResult }) {
	const [loginUsername, setLoginUsername] = useState("demo");
	const [loginPassword, setLoginPassword] = useState("demo123");
	const [sessionId, setSessionId] = useState("");

	// Generate a unique session ID on component mount
	useEffect(() => {
		// Generate a random session ID (e.g., "sess_abc123xyz")
		const generateSessionId = () => {
			const randomPart = Math.random().toString(36).substring(2, 11);
			return `sess_${randomPart}`;
		};
		setSessionId(generateSessionId());
	}, []);

	// Helper to get current timestamp
	const getTimestamp = () => Math.floor(Date.now() / 60000);

	// Login with Two-Way Encryption
	const handleLogin = async () => {
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const credentials = {
				username: loginUsername,
				password: loginPassword,
			};

			// Encrypt credentials before sending using session-based login rules
			const encryptedCredentials = encryptFise(
				JSON.stringify(credentials),
				xorCipher,
				getRulesForDemo("login-session"),
				{
					timestamp: getTimestamp(),
					metadata: { sessionId: sessionId }
				}
			);

			const response = await fetch(`${API_BASE}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					data: encryptedCredentials,
					sessionId: sessionId
				}),
			});

			if (!response.ok) {
				throw new Error("Login failed");
			}

			const { token } = await response.json();

			// Decrypt the token to show its contents using session-based login rules
			const plaintext = decryptFise(
				token,
				xorCipher,
				getRulesForDemo("login-session"),
				{
					timestamp: getTimestamp(),
					metadata: { sessionId: sessionId }
				}
			);
			const tokenData = JSON.parse(plaintext);

			setResult({
				encrypted: {
					sentCredentials: encryptedCredentials,
					receivedToken: token,
				},
				decrypted: {
					sentCredentials: credentials,
					receivedToken: tokenData,
				},
				success: true,
				sessionId: sessionId, // Include session ID in results
			});
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[400px]">
			<h2 className="mb-2 text-3xl text-dark">Login with JWT Token & Two-Way Encryption</h2>
			<p className="text-gray mb-6 leading-relaxed">
				POST encrypted credentials to{" "}
				<code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">/api/auth/login</code> - Server generates
				JWT token, encrypts it with user data, and
				returns it encrypted
			</p>
			<div className="flex gap-2 mb-4 flex-wrap">
				<span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-primaryLight text-primaryDark">
					Rules: {RULES_METADATA["login-session"].name}
				</span>
				<span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-successBg text-successDark">
					Two-Way Encrypted
				</span>
				<span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-successBg text-successDark">
					🎫 JWT Token
				</span>
				<span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-infoBg text-infoDark">
					🔐 Session-Based
				</span>
			</div>

			<div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mb-4">
				<strong className="text-infoDark">
					🔄 Two-Way Encryption Flow with JWT:
				</strong>
				<ol className="mt-2 mb-0 pl-6 space-y-1 text-sm text-dark">
					<li>Client encrypts username/password</li>
					<li>
						Server decrypts and validates
						credentials
					</li>
					<li>
						Server generates JWT token (signed with
						secret)
					</li>
					<li>
						Server encrypts JWT + user data with
						FISE
					</li>
					<li>
						Client decrypts and receives JWT token
					</li>
				</ol>
			</div>
			<div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mb-4">
				<strong className="text-infoDark">🔐 Session-Based Encryption:</strong>
				<ul className="mt-2 mb-0 pl-5 list-disc space-y-1 text-sm text-dark">
					<li>Each login session gets a unique session ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">{sessionId || "Generating..."}</code></li>
					<li>Same credentials encrypt differently per session</li>
					<li>Session ID is used in metadata to create unique encryption patterns</li>
					<li>Enhanced security through session isolation</li>
				</ul>
			</div>
			<div className="bg-successBg/30 border-l-4 border-success p-4 rounded-lg mb-6">
				<strong className="text-successDark">✅ Security Features:</strong>
				<ul className="mt-2 mb-0 pl-5 list-disc space-y-1 text-sm text-dark">
					<li>Credentials encrypted before transmission</li>
					<li>JWT token encrypted with FISE for additional protection</li>
					<li>Two-way encryption ensures end-to-end security</li>
					<li>Session-based rules create unique encryption per session</li>
				</ul>
			</div>

			<div className="mb-6">
				<label className="block mb-2 font-semibold text-dark">Username:</label>
				<input
					type="text"
					className="w-full px-3 py-3 border-2 border-border rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-primary"
					value={loginUsername}
					onChange={(e) =>
						setLoginUsername(e.target.value)
					}
					placeholder="demo"
				/>
			</div>

			<div className="mb-6">
				<label className="block mb-2 font-semibold text-dark">Password:</label>
				<input
					type="password"
					className="w-full px-3 py-3 border-2 border-border rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-primary"
					value={loginPassword}
					onChange={(e) =>
						setLoginPassword(e.target.value)
					}
					placeholder="demo123"
				/>
			</div>

			<button
				className="inline-block px-6 py-3 rounded-lg font-semibold text-base border-none cursor-pointer bg-primary text-white active:opacity-[0.8] md:w-full md:text-center disabled:opacity-50 disabled:cursor-not-allowed"
				onClick={handleLogin}
				disabled={loading}
			>
				{loading
					? "Logging in..."
					: "Login with Encryption"}
			</button>

			<div className="mt-4 text-sm text-gray">
				Use credentials: <code>demo / demo123</code>
			</div>
		</div>
	);
}

