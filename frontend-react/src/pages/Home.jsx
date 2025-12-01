import { Link } from 'react-router-dom'

function Home() {
	return (
		<div>
			{/* Hero Section */}
			<section className="py-24 text-white text-center bg-gradient-to-br from-primary to-secondary">
				<div className="max-w-[1200px] mx-auto px-5">
					<div className="max-w-[900px] mx-auto">
						<h1 className="text-6xl md:text-4xl font-extrabold m-0 leading-tight">
							FISE
						</h1>
						<p className="text-xl md:text-lg my-6 opacity-90 leading-relaxed max-w-[600px] mx-auto">
							FISE is a keyless, rule-based, high-performance semantic envelope for protecting the meaning of API responses and frontend data.

						</p>

						<div className="flex gap-5 justify-center my-8 flex-col md:flex-row">
							<Link to="/demo" className="inline-block px-6 py-3 rounded-lg font-semibold !no-underline text-base  transition-all duration-300 cursor-pointer bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary">
								Try Live Demo
							</Link>
							<a
								href="https://github.com/anbkit/fise/blob/main/docs/WHITEPAPER.md"
								className="inline-block px-6 py-3 rounded-lg font-semibold text-base !no-underline transition-all duration-300 cursor-pointer bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary"
								target="_blank"
								rel="noopener noreferrer"
							>
								Engineering Paper
							</a>
						</div>
						<div className="mt-12 text-left">
							<pre className="bg-codeBg text-codeText p-5 rounded-lg overflow-x-auto text-sm leading-normal font-mono text-[0.85rem] max-w-[700px] mx-auto">
								{`npm install fise

import { fiseEncrypt, fiseDecrypt, FiseBuilder } from 'fise'

const rules = FiseBuilder.defaults().build()
const encrypted = fiseEncrypt('secret data', rules)
const decrypted = fiseDecrypt(encrypted, rules)`}
							</pre>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-20">
				<div className="max-w-[1200px] mx-auto px-5">
					<h2 className="text-center text-4xl md:text-3xl font-bold mb-12 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">How It Works</h2>
					<div className="flex flex-col gap-12 max-w-[800px] mx-auto">
						<div className="flex flex-col gap-4">
							<div className="w-[50px] h-[50px] bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-2">
								1
							</div>
							<h3 className="text-2xl font-semibold text-dark m-0">Define Rules</h3>
							<p className="text-gray leading-relaxed mb-4">
								Choose from 12 presets or create custom rules for offset, length encoding, and salt handling.
							</p>
							<pre className="bg-codeBg text-codeText p-5 rounded-lg overflow-x-auto text-sm leading-normal font-mono">
								{`const rules = FiseBuilder.defaults()
  .withSaltRange(15, 50)
  .build()`}
							</pre>
						</div>

						<div className="flex flex-col gap-4">
							<div className="w-[50px] h-[50px] bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-2">
								2
							</div>
							<h3 className="text-2xl font-semibold text-dark m-0">Encrypt Data</h3>
							<p className="text-gray leading-relaxed mb-4">
								Pass your plaintext, cipher function, and rules. FISE handles the rest.
							</p>
							<pre className="bg-codeBg text-codeText p-5 rounded-lg overflow-x-auto text-sm leading-normal font-mono">
								{`const encrypted = fiseEncrypt(
  'sensitive data',
  rules
)`}
							</pre>
						</div>

						<div className="flex flex-col gap-4">
							<div className="w-[50px] h-[50px] bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-2">
								3
							</div>
							<h3 className="text-2xl font-semibold text-dark m-0">Decrypt Anywhere</h3>
							<p className="text-gray leading-relaxed mb-4">
								Use the same rules to decrypt. Works across all platforms.
							</p>
							<pre className="bg-codeBg text-codeText p-5 rounded-lg overflow-x-auto text-sm leading-normal font-mono">
								{`const decrypted = fiseDecrypt(
  encrypted,
  rules
)`}
							</pre>
						</div>
					</div>
				</div>
			</section>

		</div>
	)
}

export default Home
