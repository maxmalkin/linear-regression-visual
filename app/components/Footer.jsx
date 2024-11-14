import Link from 'next/link';

export default function Footer() {
	return (
		<footer className="flex justify-center items-center mt-10 font-light underline">
			<Link href="https://github.com/maxmalkin/linear-regression-visual">
				Created by Max Malkin, 2024
			</Link>
		</footer>
	);
}
