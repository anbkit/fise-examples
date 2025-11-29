export default function VideoEncryptionResults({ videoEncryptionResult }) {
	if (!videoEncryptionResult) return null;

	return (
		<div className="mt-8">
			<h3 className="text-2xl font-bold text-dark mb-6 border-b-2 border-border pb-2">Encryption Results</h3>

			<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4 mb-8">
				<div className="bg-cardBg p-4 rounded-lg border border-borderLight">
					<div className="text-[0.85rem] text-textMuted mb-2">Original Size</div>
					<div className="text-2xl font-bold text-success">
						{(videoEncryptionResult.originalSize / 1024 / 1024).toFixed(2)} MB
					</div>
				</div>
				{videoEncryptionResult.base64Size && (
					<div className="bg-cardBg p-4 rounded-lg border border-borderLight">
						<div className="text-[0.85rem] text-textMuted mb-2">Base64 Size</div>
						<div className="text-2xl font-bold text-gray">
							{(videoEncryptionResult.base64Size / 1024 / 1024).toFixed(2)} MB
						</div>
					</div>
				)}
				<div className="bg-cardBg p-4 rounded-lg border border-borderLight">
					<div className="text-[0.85rem] text-textMuted mb-2">Encrypted Size</div>
					<div className="text-2xl font-bold text-error">
						{(videoEncryptionResult.encryptedSize / 1024 / 1024).toFixed(2)} MB
					</div>
					{videoEncryptionResult.sizeDifference !== undefined && (
						<div className="text-[0.75rem] text-textMuted mt-1">
							(+{videoEncryptionResult.sizeDifference.toLocaleString()} bytes)
						</div>
					)}
				</div>
				{videoEncryptionResult.downloadTime && (
					<div className="bg-cardBg p-4 rounded-lg border border-borderLight">
						<div className="text-[0.85rem] text-textMuted mb-2">Download Time</div>
						<div className="text-2xl font-bold text-info">
							{videoEncryptionResult.downloadTime} ms
						</div>
					</div>
				)}
				<div className="bg-cardBg p-4 rounded-lg border border-borderLight">
					<div className="text-[0.85rem] text-textMuted mb-2">Encryption Time</div>
					<div className="text-2xl font-bold text-warning">
						{videoEncryptionResult.encryptionTime} ms
					</div>

				</div>
				{videoEncryptionResult.decryptionTime && (
					<div className="bg-cardBg p-4 rounded-lg border border-borderLight">
						<div className="text-[0.85rem] text-textMuted mb-2">Decryption Time</div>
						<div className="text-2xl font-bold text-warning">
							{videoEncryptionResult.decryptionTime} ms
						</div>
					</div>
				)}
			</div>

			{videoEncryptionResult.decryptedBlobUrl && (
				<div className="mt-8">
					<h4>Decrypted Video Preview:</h4>
					<video
						controls
						src={videoEncryptionResult.decryptedBlobUrl}
						className="w-full max-w-[800px] mt-4 rounded-lg"
					/>
				</div>
			)}
		</div>
	);
}

