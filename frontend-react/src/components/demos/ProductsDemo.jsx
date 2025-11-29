import { decryptFise, xorCipher } from "fise";
import { getRulesForDemo, RULES_METADATA } from "@fise-examples/shared";
import { API_BASE } from "../../config.ts";

export default function ProductsDemo({ loading, setLoading, setError, setResult }) {
	// Fetch products - store encrypted data, decrypt during rendering
	const fetchProducts = async () => {
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const response = await fetch(`${API_BASE}/api/products`);
			const { data } = await response.json();

			// Store encrypted products - decryption happens during rendering
			setResult({
				encrypted: JSON.stringify(data, null, 2),
				encryptedProducts: data, // Store encrypted products for per-item decryption
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
			<h2 className="mb-2 text-3xl text-dark">Selective Encrypt & Lazy Decrypt</h2>
			<p className="text-gray mb-6 leading-relaxed">
				GET request to <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">/api/products</code> -
				Returns encrypted product list with selective field encryption and lazy decryption
			</p>
			<div className="flex gap-2 mb-4 flex-wrap">
				<span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-primaryLight text-primaryDark">
					Rules: {RULES_METADATA["products"].name}
				</span>
			</div>
			<div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mb-6">
				<strong className="text-infoDark">🔐 Per-Item Encryption Pattern:</strong>
				<ul className="mt-2 mb-0 pl-5 list-disc space-y-1 text-sm text-dark">
					<li>
						Each product's <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">name</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">price</code> are encrypted <strong>separately</strong> with individual encryption rules
					</li>
					<li>
						Encryption offset is calculated using <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">product.id</code> passed via <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">metadata</code> in the encryption context
					</li>
					<li>
						Each product gets a <strong>unique encryption pattern</strong> - even identical values produce different ciphertexts based on the product ID
					</li>
					<li>
						Decryption happens <strong>on-demand during rendering</strong> - each product card decrypts its own data when displayed
					</li>
					<li>
						Click <strong>"Show Encrypted Values"</strong> on any product card to see the encrypted ciphertext and compare patterns between products
					</li>
					<li>
						Other fields (ID, features) remain unencrypted for demonstration purposes
					</li>
				</ul>
			</div>

			<button
				className="inline-block px-6 py-3 rounded-lg font-semibold text-base border-none cursor-pointer bg-primary text-white active:opacity-[0.8] md:w-full md:text-center disabled:opacity-50 disabled:cursor-not-allowed"
				onClick={fetchProducts}
				disabled={loading}
			>
				{loading ? "Fetching..." : "Fetch Products"}
			</button>
		</div>
	);
}

