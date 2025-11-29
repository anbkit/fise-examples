import { useState, useEffect } from "react";
import { decryptFise, xorCipher } from "fise";
import { getRulesForDemo } from "@fise-examples/shared";

// Helper function to decrypt a single product item
const decryptProductItem = (encryptedProduct) => {
	try {
		const decryptedName = decryptFise(
			encryptedProduct.name,
			xorCipher,
			getRulesForDemo("products"),
			{ metadata: { productId: encryptedProduct.id } }
		);

		const decryptedPrice = decryptFise(
			encryptedProduct.price,
			xorCipher,
			getRulesForDemo("products"),
			{ metadata: { productId: encryptedProduct.id } }
		);

		return {
			id: encryptedProduct.id,
			name: decryptedName,
			price: parseFloat(decryptedPrice),
			features: encryptedProduct.features
		};
	} catch (err) {
		return {
			id: encryptedProduct.id,
			name: `[Decryption Error: ${err.message}]`,
			price: 0,
			features: encryptedProduct.features,
			error: true
		};
	}
};

// ProductCard component with lazy decryption
function ProductCard({ encryptedProduct }) {
	const [isDecrypted, setIsDecrypted] = useState(false);
	const [product, setProduct] = useState(null);

	// Decrypt function
	const decrypt = () => {
		if (!isDecrypted && !product) {
			const decrypted = decryptProductItem(encryptedProduct);
			setProduct(decrypted);
			setIsDecrypted(true);
		}
	};

	// Auto-decrypt after 2 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			decrypt();
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	// Show encrypted data initially, decrypted on hover or after 2s
	const displayProduct = product || {
		id: encryptedProduct.id,
		name: encryptedProduct.name,
		price: encryptedProduct.price,
		features: encryptedProduct.features,
		isEncrypted: !isDecrypted
	};

	return (
		<div
			key={encryptedProduct.id}
			className={`border border-borderMedium rounded-lg p-6 ${product?.error ? 'bg-warningBg' : 'bg-white'} shadow-[0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer`}
			onMouseEnter={decrypt}
		>
			{/* Header with ID and metadata indicator */}
			<div className="flex justify-between items-center mb-2">
				<span className="text-[0.85rem] text-textMuted font-semibold">
					ID: {displayProduct.id}
				</span>
				<span className="text-xs text-infoDark px-2 py-1 rounded font-semibold">
					productId: {displayProduct.id}
				</span>
			</div>

			{/* Show encrypted indicator */}
			{displayProduct.isEncrypted && (
				<div className="mb-2 text-xs text-warning font-semibold">
					🔒 Encrypted - Hover or wait 2s to decrypt
				</div>
			)}

			{/* Decrypted content */}
			<h3 className={`my-2 ${product?.error ? 'text-errorDark' : 'text-textDark'}`}>
				{displayProduct.isEncrypted ? (
					<span className="font-mono text-sm text-textMuted break-words">{displayProduct.name}</span>
				) : (
					displayProduct.name
				)}
			</h3>
			<div className="text-2xl font-bold text-infoDark my-2">
				{displayProduct.isEncrypted ? (
					<span className="font-mono text-sm text-textMuted">{displayProduct.price}</span>
				) : (
					`$${displayProduct.price.toFixed(2)}`
				)}
			</div>

			{/* Features */}
			{displayProduct.features && displayProduct.features.length > 0 && (
				<div className="mt-4">
					<div className="text-sm text-textMuted mb-2">
						Features:
					</div>
					<ul className="m-0 pl-6 text-sm text-textMedium">
						{displayProduct.features.map((feature, idx) => (
							<li key={idx}>{feature}</li>
						))}
					</ul>
				</div>
			)}

			{/* Error message */}
			{product?.error && (
				<div className="mt-2 text-[0.85rem] text-errorDark">
					Decryption failed
				</div>
			)}
		</div>
	);
}

export default function ResultsDisplay({ result, activeTab }) {
	if (!result) return null;

	return (
		<div className="mt-8">
			<h3 className="text-2xl font-bold text-dark mb-6 border-b-2 border-border pb-2">Results</h3>

			{/* Show two-way flow for login */}
			{activeTab === "login" && result.encrypted?.sentCredentials && (
				<>
					<div className="mb-6">
						<h4 className="text-dark font-semibold mb-2">
							🔒 Step 1: Encrypted Credentials
							<span className="text-textMuted text-sm font-normal"> (sent to server)</span>
						</h4>
						<div className="bg-warningBg border-2 border-warning rounded-lg p-4 min-h-[120px] overflow-auto text-left font-mono break-words shadow-sm">
							<pre className="text-sm text-dark m-0 whitespace-pre-wrap break-words">
								{result.encrypted.sentCredentials}
							</pre>
						</div>
					</div>

					<div className="mb-6">
						<h4 className="text-dark font-semibold mb-2">
							✅ Step 2: Decrypted Credentials
							<span className="text-textMuted text-sm font-normal"> (server-side)</span>
						</h4>
						<div className="bg-successBg/30 border-2 border-success rounded-lg p-4 min-h-[120px] overflow-auto text-left shadow-sm">
							<pre className="text-sm text-dark m-0">
								{JSON.stringify(
									result.decrypted.sentCredentials,
									null,
									2
								)}
							</pre>
						</div>
					</div>

					<div className="mb-6">
						<h4 className="text-dark font-semibold mb-2">
							🔒 Step 3: Encrypted Response
							<span className="text-textMuted text-sm font-normal"> (from server)</span>
						</h4>
						<div className="bg-warningBg border-2 border-warning rounded-lg p-4 min-h-[120px] overflow-auto text-left font-mono break-words shadow-sm">
							<pre className="text-sm text-dark m-0 whitespace-pre-wrap break-words">
								{result.encrypted.receivedToken}
							</pre>
						</div>
					</div>

					<div className="mb-6">
						<h4 className="text-dark font-semibold mb-2">
							✅ Step 4: Decrypted Response
							<span className="text-textMuted text-sm font-normal"> (client-side)</span>
						</h4>
						<div className="bg-successBg/30 border-2 border-success rounded-lg p-4 min-h-[120px] overflow-auto text-left shadow-sm">
							<pre className="text-sm text-dark m-0">
								{JSON.stringify(
									result.decrypted.receivedToken,
									null,
									2
								)}
							</pre>
						</div>
					</div>
				</>
			)}

			{/* Products display - decrypt per item during rendering */}
			{activeTab === "products" && result.encryptedProducts && (
				<>
					<div className="mb-6">
						<h4 className="text-dark font-semibold mb-2">🔒 Encrypted Data <span className="text-textMuted text-sm font-normal">(from server)</span>:</h4>
						<div className="bg-warningBg border-2 border-warning rounded-lg p-4 min-h-[120px] overflow-auto text-left font-mono break-words shadow-sm">
							<pre className="text-sm text-dark m-0 whitespace-pre-wrap break-words">{result.encrypted}</pre>
						</div>
					</div>

					<div>
						<h4 className="text-dark font-semibold mb-2">
							✅ Decrypted Products
							<span className="ml-2 inline-block px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-primary to-secondary text-white">
								⚡ Lazy Decryption: Decrypt Whenever & Anywhere
							</span>
						</h4>
						<div className="bg-gradient-to-r from-infoBg to-primaryLightBg border-l-4 border-info p-4 rounded-lg mb-4 shadow-sm">
							<strong className="text-infoDark text-base block mb-2">🚀 Lazy Decryption Feature:</strong>
							<div className="grid md:grid-cols-2 gap-3 text-sm">
								<div className="bg-white/50 rounded p-3">
									<strong className="text-primaryDark block mb-1">⏱️ Auto-Decrypt (2s):</strong>
									<span className="text-dark">Each product automatically decrypts after 2 seconds</span>
								</div>
								<div className="bg-white/50 rounded p-3">
									<strong className="text-primaryDark block mb-1">🖱️ Hover to Decrypt:</strong>
									<span className="text-dark">Hover over any product card to decrypt immediately</span>
								</div>
							</div>
							<div className="mt-3 pt-3 border-t border-info/30">
								<strong className="text-successDark">✨ Key Benefits:</strong>
								<ul className="mt-1 mb-0 pl-5 list-disc space-y-1 text-dark">
									<li><strong>On-demand decryption</strong> - Only decrypt what you need, when you need it</li>
									<li><strong>Better performance</strong> - Avoid decrypting all items at once</li>
									<li><strong>Flexible timing</strong> - Decrypt whenever (auto) or anywhere (hover)</li>
									<li><strong>User-controlled</strong> - You decide when to reveal the data</li>
								</ul>
							</div>
						</div>
						<div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
							{result.encryptedProducts.map((encryptedProduct) => (
								<ProductCard key={encryptedProduct.id} encryptedProduct={encryptedProduct} />
							))}
						</div>
					</div>
				</>
			)}

			{/* Regular display for other tabs */}
			{activeTab !== "login" && activeTab !== "products" && (
				<>
					<div className="mb-6">
						<h4 className="text-dark font-semibold mb-2">🔒 Encrypted Data <span className="text-textMuted text-sm font-normal">(from server)</span>:</h4>
						<div className="bg-warningBg border-2 border-warning rounded-lg p-4 min-h-[120px] overflow-auto text-left font-mono break-words shadow-sm">
							<pre className="text-sm text-dark m-0 whitespace-pre-wrap break-words">
								{typeof result.encrypted === "string"
									? result.encrypted
									: JSON.stringify(result.encrypted, null, 2)}
							</pre>
						</div>
					</div>

					<div>
						<h4 className="text-dark font-semibold mb-2">✅ Decrypted Data <span className="text-textMuted text-sm font-normal">(readable)</span>:</h4>
						<div className="bg-successBg/30 border-2 border-success rounded-lg p-4 min-h-[120px] overflow-auto text-left shadow-sm">
							<pre className="text-sm text-dark m-0">
								{typeof result.decrypted === "string"
									? result.decrypted
									: JSON.stringify(result.decrypted, null, 2)}
							</pre>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

