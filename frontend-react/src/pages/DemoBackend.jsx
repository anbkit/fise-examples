import { useState } from "react";
import UserDataDemo from "../components/demos/UserDataDemo";
import ProductsDemo from "../components/demos/ProductsDemo";
import VideoEncryptDemo from "../components/demos/VideoEncryptDemo";
import LoginDemo from "../components/demos/LoginDemo";
import VideoEncryptionResults from "../components/demos/VideoEncryptionResults";
import ResultsDisplay from "../components/demos/ResultsDisplay";

function DemoBackend() {
	const [activeTab, setActiveTab] = useState("user-data");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [result, setResult] = useState(null);
	const [encryptionProgress, setEncryptionProgress] = useState(0);
	const [videoEncryptionResult, setVideoEncryptionResult] = useState(null);
	const [downloadingVideo, setDownloadingVideo] = useState(false);

	const demos = [
		{
			id: "user-data",
			title: "User Data",
			icon: "",
		},
		{
			id: "products",
			title: "Selective Encrypt & Lazy Decrypt",
			icon: "",
		},
		{
			id: "video-encrypt",
			title: "Video/Binary Encryption",
			icon: "",
		},
		{ id: "login", title: "Login", icon: "" },
	];

	return (
		<div className="py-12 min-h-[calc(100vh-200px)]">
			<div className="max-w-[1200px] mx-auto px-5">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-3xl font-bold mb-4 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">Interactive Live Demo</h1>
					<p className="text-lg text-gray max-w-[700px] mx-auto">
						This interactive demo showcases FISE encryption in action.
					</p>
					<div className="bg-infoBg border-l-4 border-info p-4 rounded-lg mt-4 max-w-[700px] mx-auto">
						<p className="text-sm text-dark mb-0">
							View the source code demo implementation for the frontend, backend, and shared rules on{" "}
							<a
								href="https://github.com/anbkit/fise-examples"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline font-semibold"
							>
								GitHub
							</a>
							.
						</p>
					</div>
				</div>

				{/* Demo Tabs */}
				<div className="flex gap-2 mb-8 border-b-2 border-border overflow-x-auto overflow-y-hidden">
					{demos.map((demo) => (
						<button
							key={demo.id}
							className={`px-8 md:px-4 py-4 bg-transparent border-none border-b-[3px] border-b-transparent cursor-pointer text-base font-semibold text-gray transition-all duration-300 -mb-[2px] whitespace-nowrap flex items-center gap-2 ${activeTab === demo.id ? "text-primary border-b-primary" : "hover:text-primary"
								}`}
							onClick={() => {
								setActiveTab(demo.id);
								setResult(null);
								setError(null);
							}}
						>
							<span>{demo.icon}</span> {demo.title}
						</button>
					))}
				</div>

				{/* Tab Content */}
				<div className="bg-white rounded-xl p-6 md:p-4 shadow-md">
					{activeTab === "user-data" && (
						<UserDataDemo
							loading={loading}
							setLoading={setLoading}
							setError={setError}
							setResult={setResult}
						/>
					)}

					{activeTab === "products" && (
						<ProductsDemo
							loading={loading}
							setLoading={setLoading}
							setError={setError}
							setResult={setResult}
						/>
					)}

					{activeTab === "video-encrypt" && (
						<VideoEncryptDemo
							loading={loading}
							setLoading={setLoading}
							error={error}
							setError={setError}
							videoEncryptionResult={videoEncryptionResult}
							setVideoEncryptionResult={setVideoEncryptionResult}
							encryptionProgress={encryptionProgress}
							setEncryptionProgress={setEncryptionProgress}
							downloadingVideo={downloadingVideo}
							setDownloadingVideo={setDownloadingVideo}
						/>
					)}

					{activeTab === "login" && (
						<LoginDemo
							loading={loading}
							setLoading={setLoading}
							setError={setError}
							setResult={setResult}
						/>
					)}

					{/* Error Display */}
					{error && activeTab !== "video-encrypt" && (
						<div className="mt-8 p-4 bg-errorBg border-2 border-error rounded-lg text-error">
							<strong>Error:</strong> {error}
						</div>
					)}

					{/* Video Encryption Results */}
					{activeTab === "video-encrypt" && (
						<VideoEncryptionResults videoEncryptionResult={videoEncryptionResult} />
					)}

					{/* Results Display */}
					{activeTab !== "video-encrypt" && (
						<ResultsDisplay result={result} activeTab={activeTab} />
					)}
				</div>
			</div>
		</div>
	);
}

export default DemoBackend;
