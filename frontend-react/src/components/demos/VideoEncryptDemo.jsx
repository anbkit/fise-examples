import { useState } from "react";
import { encryptBinaryFise, decryptBinaryFise, xorBinaryCipher } from "fise";
import { getRulesForDemo, RULES_METADATA } from "@fise-examples/shared";

export default function VideoEncryptDemo({
	loading,
	setLoading,
	error,
	setError,
	videoEncryptionResult,
	setVideoEncryptionResult,
	encryptionProgress,
	setEncryptionProgress,
	downloadingVideo,
	setDownloadingVideo
}) {
	const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");

	// Helper to get current timestamp
	const getTimestamp = () => Math.floor(Date.now() / 60000);

	// Download and encrypt video from URL in one action
	const downloadAndEncryptVideo = async () => {
		if (!videoUrl || !videoUrl.trim()) {
			setError("Please enter a video URL");
			return;
		}

		setLoading(true);
		setDownloadingVideo(true);
		setError(null);
		setVideoEncryptionResult(null);
		setEncryptionProgress(0);

		try {
			// Step 1: Download video
			console.log('Downloading video from:', videoUrl);
			setEncryptionProgress(10);
			const downloadStartTime = performance.now();

			const response = await fetch(videoUrl, {
				mode: 'cors',
				headers: {
					'User-Agent': 'FISE-Demo/1.0',
				},
			});

			setEncryptionProgress(20);

			if (!response.ok) {
				throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
			}

			const contentType = response.headers.get('content-type') || 'video/mp4';

			setEncryptionProgress(30);

			const arrayBuffer = await response.arrayBuffer();
			const originalSize = arrayBuffer.byteLength;
			const downloadTime = performance.now() - downloadStartTime;
			setEncryptionProgress(40);

			// Extract filename from URL or use default
			let fileName = 'video.mov';
			try {
				const urlPath = new URL(videoUrl).pathname;
				fileName = urlPath.split('/').pop() || 'video.mov';
			} catch (e) {
				console.warn('Could not parse URL for filename:', e);
			}

			// Step 2: Split into head, middle, tail (only encode/encrypt head and tail)
			setEncryptionProgress(50);
			const ENCRYPT_PERCENTAGE = 0.05; // 5% from start and 5% from end
			const headByteCount = Math.floor(arrayBuffer.byteLength * ENCRYPT_PERCENTAGE);
			const tailByteCount = Math.floor(arrayBuffer.byteLength * ENCRYPT_PERCENTAGE);

			// Extract parts as Uint8Array (keep everything as binary)
			const uint8Array = new Uint8Array(arrayBuffer);
			const headBinary = uint8Array.slice(0, headByteCount);
			const middleBinary = uint8Array.slice(headByteCount, arrayBuffer.byteLength - tailByteCount);
			const tailBinary = uint8Array.slice(arrayBuffer.byteLength - tailByteCount);

			const encryptionStartTime = performance.now();
			setEncryptionProgress(60);
			const rules = getRulesForDemo("video");
			const timestamp = getTimestamp();
			const [encryptedHeadBinary, encryptedTailBinary] = await Promise.all([
				encryptBinaryFise(
					headBinary,
					xorBinaryCipher,
					rules,
					{
						timestamp,
						metadata: { part: 'head' }
					}
				),
				encryptBinaryFise(
					tailBinary,
					xorBinaryCipher,
					rules,
					{
						timestamp,
						metadata: { part: 'tail' }
					}
				)
			]);

			setEncryptionProgress(85);

			// Store as binary format: [headEncryptedLen:4][tailEncryptedLen:4][encryptedHead][middleBinary][encryptedTail]
			// Both lengths in header (first 8 bytes) for easy reading
			const encryptedHeadBytes = encryptedHeadBinary;
			const encryptedTailBytes = encryptedTailBinary;

			// Create length buffers (4 bytes each, big-endian)
			const headLenBuf = new ArrayBuffer(4);
			new DataView(headLenBuf).setUint32(0, encryptedHeadBytes.length, false);
			const tailLenBuf = new ArrayBuffer(4);
			new DataView(tailLenBuf).setUint32(0, encryptedTailBytes.length, false);

			// Combine all parts: [headLen:4][tailLen:4][head][middle][tail]
			const totalSize = 8 + encryptedHeadBytes.length + middleBinary.length + encryptedTailBytes.length;
			const combined = new Uint8Array(totalSize);
			let offset = 0;

			// Write header: both lengths first
			combined.set(new Uint8Array(headLenBuf), offset);
			offset += 4;
			combined.set(new Uint8Array(tailLenBuf), offset);
			offset += 4;
			// Write encrypted head
			combined.set(encryptedHeadBytes, offset);
			offset += encryptedHeadBytes.length;
			// Write middle (not encrypted)
			combined.set(middleBinary, offset);
			offset += middleBinary.length;
			// Write encrypted tail
			combined.set(encryptedTailBytes, offset);

			const encryptionTime = performance.now() - encryptionStartTime;
			const encryptedSize = combined.byteLength;
			const sizeDifference = encryptedSize - originalSize; // Exact byte difference

			setEncryptionProgress(100);

			setVideoEncryptionResult({
				encryptedData: combined, // Store as Uint8Array (pure binary, no JSON)
				originalSize,
				encryptedSize,
				sizeDifference, // Store exact byte difference
				downloadTime: downloadTime.toFixed(2),
				encryptionTime: encryptionTime.toFixed(2),
				totalTime: (downloadTime + encryptionTime).toFixed(2),
				fileName,
				fileType: contentType,
				headBytes: headByteCount,
				tailBytes: tailByteCount,
				encryptedPercentage: ((headByteCount + tailByteCount) / originalSize * 100).toFixed(1),
				timestamp // Store timestamp used during encryption for decryption
			});

			console.log('Video downloaded and encrypted successfully');

			// Clear progress after a moment
			setTimeout(() => setEncryptionProgress(0), 1000);
		} catch (err) {
			console.error('Download/Encrypt error:', err);
			setError(`Failed: ${err.message}. Make sure the URL is accessible and supports CORS.`);
			setEncryptionProgress(0);
		} finally {
			setLoading(false);
			setDownloadingVideo(false);
		}
	};

	// Decrypt video
	const decryptVideo = async () => {
		if (!videoEncryptionResult) {
			setError("No encrypted video to decrypt");
			return;
		}

		setLoading(true);
		setError(null);
		setEncryptionProgress(0);

		try {
			const startTime = performance.now();

			setEncryptionProgress(10);

			const data = new Uint8Array(videoEncryptionResult.encryptedData);
			let offset = 0;

			setEncryptionProgress(20);


			const headLenSlice = data.slice(0, 4);
			const headLen = new DataView(headLenSlice.buffer, headLenSlice.byteOffset, 4).getUint32(0, false);

			const tailLenSlice = data.slice(4, 8);
			const tailLen = new DataView(tailLenSlice.buffer, tailLenSlice.byteOffset, 4).getUint32(0, false);

			offset = 8; // Skip header

			// Validate lengths
			if (headLen <= 0 || tailLen <= 0 || headLen + tailLen > data.length - 8) {
				throw new Error(`Invalid lengths: head=${headLen}, tail=${tailLen}, total=${data.length}`);
			}

			// Read encrypted head
			const encryptedHeadBinary = data.slice(offset, offset + headLen);
			offset += headLen;

			setEncryptionProgress(30);

			// Calculate middle length: total - header(8) - headLen - tailLen
			const middleLength = data.length - 8 - headLen - tailLen;
			if (middleLength < 0) {
				throw new Error(`Invalid middle length: ${middleLength}`);
			}

			// Read middle (not encrypted)
			const middleBinary = data.slice(offset, offset + middleLength);
			offset += middleLength;

			// Read encrypted tail
			const encryptedTailBinary = data.slice(offset, offset + tailLen);

			setEncryptionProgress(40);

			// Decrypt head and tail parts in parallel using FISE 0.1.4
			// Use videoRules which bounds offset to 1MB for fast decryption
			// Use the same timestamp that was used during encryption
			const rules = getRulesForDemo("video");
			const timestamp = videoEncryptionResult.timestamp || getTimestamp();

			const decryptStartTime = performance.now();
			const [decryptedHeadBinary, decryptedTailBinary] = await Promise.all([
				decryptBinaryFise(
					encryptedHeadBinary,
					xorBinaryCipher,
					rules,
					{
						timestamp,
						metadata: { part: 'head' }
					}
				),
				decryptBinaryFise(
					encryptedTailBinary,
					xorBinaryCipher,
					rules,
					{
						timestamp,
						metadata: { part: 'tail' }
					}
				)
			]);
			const decryptTime = performance.now() - decryptStartTime;
			console.log(`Decryption took: ${decryptTime.toFixed(2)}ms (head: ${encryptedHeadBinary.length} bytes, tail: ${encryptedTailBinary.length} bytes)`);

			setEncryptionProgress(80);

			const blobStartTime = performance.now();
			// Create blob directly from parts - no need to reconstruct full array
			// This is much faster for large videos as it avoids large memory allocation and copy
			const blob = new Blob([decryptedHeadBinary, middleBinary, decryptedTailBinary], { type: videoEncryptionResult.fileType });
			const blobUrl = URL.createObjectURL(blob);
			const blobTime = performance.now() - blobStartTime;
			console.log(`Blob creation took: ${blobTime.toFixed(2)}ms`);

			const decryptionTime = performance.now() - startTime;
			console.log(`Total decryption time: ${decryptionTime.toFixed(2)}ms`);

			setEncryptionProgress(100);

			setVideoEncryptionResult({
				...videoEncryptionResult,
				decryptedBlobUrl: blobUrl,
				decryptionTime: decryptionTime.toFixed(2)
			});

			setTimeout(() => setEncryptionProgress(0), 1000);
		} catch (err) {
			console.error('Decryption error:', err);
			setError(`Decryption failed: ${err.message}`);
			setEncryptionProgress(0);
		} finally {
			setLoading(false);
		}
	};

	// Download encrypted video
	const downloadEncryptedVideo = () => {
		if (!videoEncryptionResult) return;

		// encryptedData is now Uint8Array (binary), create blob directly
		const blob = new Blob([videoEncryptionResult.encryptedData], { type: 'application/octet-stream' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = videoEncryptionResult.fileName + '.encrypted';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// Download decrypted video
	const downloadDecryptedVideo = () => {
		if (!videoEncryptionResult || !videoEncryptionResult.decryptedBlobUrl) return;

		const a = document.createElement('a');
		a.href = videoEncryptionResult.decryptedBlobUrl;
		// Remove .encrypted extension if present, or use original filename
		const originalFileName = videoEncryptionResult.fileName.replace(/\.(encrypted|enc)$/i, '') || 'decrypted-video';
		// Preserve original extension if it exists
		const hasExtension = /\.(mp4|webm|mov|avi|mkv)$/i.test(videoEncryptionResult.fileName);
		a.download = hasExtension ? originalFileName : `${originalFileName}.mp4`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<div className="min-h-[400px]">
			<h2 className="mb-2 text-3xl text-dark">Video/Binary Encryption</h2>
			<div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mb-6">
				<strong className="text-infoDark">ℹ️ About This Demo:</strong>
				<p className="text-sm text-dark mt-2 mb-0">
					Because the demo API does not host video, we encrypt video (binary) directly in the browser using FISE. This demonstrates the encrypt/decrypt video/binary solution and performance.
				</p>
			</div>
			<div className="flex gap-2 mb-4 flex-wrap">
				<span className="inline-block px-3 py-1 rounded-xl text-sm font-semibold bg-primaryLight text-primaryDark">
					Rules: {RULES_METADATA["video"]?.name || "Video Rules"}
				</span>
			</div>
			<div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mb-4">
				<strong className="text-infoDark">🚀 Client-Side Encryption:</strong>
				<ul className="mt-2 mb-0 pl-5 list-disc space-y-1 text-sm text-dark">
					<li>To encrypt a video, just encrypt the video by encrypting chunks (10% total: 5% head + 5% tail)</li>
					<li>Encrypt/Decrypt chunks in parallel</li>
					<li>Download the encrypted video or decrypt it back</li>
				</ul>
			</div>
			<div className="bg-successBg/30 border-l-4 border-success p-4 rounded-lg mb-6">
				<strong className="text-successDark">⚡ Performance Highlights:</strong>
				<ul className="mt-2 mb-0 pl-5 list-disc space-y-1 text-sm text-dark">
					<li>Only 10% of video is encrypted (head + tail)</li>
					<li>Parallel encryption/decryption for maximum speed</li>
					<li>Pure binary processing - no base64 conversion overhead</li>
					<li>O(n) complexity ensures fast performance even for large files</li>
				</ul>
			</div>

			<div className="mb-4">
				<label className="block mb-2 font-semibold text-dark">Video URL:</label>
				<div className="w-full gap-2">
					<input
						type="text"
						className="w-full mb-2s px-3 py-3 border-2 border-border rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-primary flex-1"
						value={videoUrl}
						onChange={(e) => setVideoUrl(e.target.value)}
						placeholder="Enter the video URL to encrypt"

					/>

				</div>
				{downloadingVideo && (
					<div className="mt-2 text-infoDark font-semibold">
						Downloading...
					</div>
				)}
				{loading && !downloadingVideo && (
					<div className="mt-2 text-infoDark font-semibold">
						Encrypting...
					</div>
				)}
			</div>

			<div className="flex gap-4 flex-wrap">
				{!videoEncryptionResult && (
					<button
						className="inline-block px-6 py-3 rounded-lg font-semibold text-base border-none cursor-pointer bg-primary text-white active:opacity-[0.8] md:w-full md:text-center disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={downloadAndEncryptVideo}
						disabled={loading || downloadingVideo || !videoUrl || !videoUrl.trim()}
					>
						{downloadingVideo ? "Downloading..." : loading ? "Encrypting..." : "Download & Encrypt Video"}
					</button>
				)}
				{videoEncryptionResult && !videoEncryptionResult.decryptedBlobUrl && (
					<>
						<div className="w-full px-6 py-3 rounded-lg font-semibold text-base bg-successBg text-successDark border-2 border-success">
							Downloaded and Encrypted
						</div>
						<button
							className="inline-block px-6 py-3 rounded-lg font-semibold text-base cursor-pointer bg-primary text-white border-none active:opacity-[0.8] md:w-full md:text-center disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={decryptVideo}
							disabled={loading}
						>
							{loading ? "Decrypting..." : "Decrypt Video"}
						</button>
					</>
				)}
				{videoEncryptionResult && (
					<button
						className="inline-block px-6 py-3 rounded-lg font-semibold text-base border-none cursor-pointer bg-primary text-white active:opacity-[0.8] md:w-full md:text-center"
						onClick={downloadEncryptedVideo}
					>
						Download Encrypted
					</button>
				)}
				{videoEncryptionResult && videoEncryptionResult.decryptedBlobUrl && (
					<button
						className="inline-block px-6 py-3 rounded-lg font-semibold text-base border-none cursor-pointer bg-primary text-white active:opacity-[0.8] md:w-full md:text-center"
						onClick={downloadDecryptedVideo}
					>
						Download Decrypted
					</button>
				)}
			</div>


			{error && (
				<div className="mt-4 p-4 bg-errorBg border-2 border-error rounded-lg text-error">
					<strong>Error:</strong> {error}
				</div>
			)}
		</div>
	);
}

