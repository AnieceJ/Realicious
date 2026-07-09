import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const items = [
	{
		id: 1,
		title: "Back End Developer",
		department: "Engineering",
		type: "Full-time",
		location: "Remote",
	},
	{
		id: 2,
		title: "Front End Developer",
		department: "Engineering",
		type: "Full-time",
		location: "Remote",
	},
	{
		id: 3,
		title: "User Interface Designer",
		department: "Design",
		type: "Full-time",
		location: "Remote",
	},
];

export default function Example() {
	return (
		<div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
			<div className="flex flex-1 justify-between sm:hidden">
				<a
					href="#"
					className="relative inline-flex items-center border border-black bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
				>
					Previous
				</a>
				<a
					href="#"
					className="relative ml-3 inline-flex items-center border border-black bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
				>
					Next
				</a>
			</div>
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700">
						Showing <span className="font-medium">1</span> to
						<span className="font-medium">10</span> of{" "}
						<span className="font-medium">97</span> results
					</p>
				</div>
				<div>
					<nav
						aria-label="Pagination"
						className="isolate inline-flex -space-x-px shadow-xs"
					>
						<a
							href="#"
							className="relative inline-flex items-center px-2 py-2 bg-red-700 text-white inset-ring inset-ring-black hover:bg-red-400 focus:z-20 focus:outline-offset-0"
						>
							<span className="sr-only">Previous</span>
							<ChevronLeftIcon aria-hidden="true" className="size-5" />
						</a>
						<a
							href="#"
							aria-current="page"
							className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
						>
							1
						</a>
						<a
							href="#"
							className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
						>
							2
						</a>
						<a
							href="#"
							className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
						>
							3
						</a>
						<span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 inset-ring inset-ring-gray-300 focus:outline-offset-0">
							...
						</span>
						<a
							href="#"
							className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
						>
							8
						</a>
						<a
							href="#"
							className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
						>
							9
						</a>
						<a
							href="#"
							className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
						>
							10
						</a>
						<a
							href="#"
							className="relative inline-flex items-center px-2 py-2 bg-red-700 text-white inset-ring inset-ring-black hover:bg-red-400 focus:z-20 focus:outline-offset-0"
						>
							<span className="sr-only">Next</span>
							<ChevronRightIcon aria-hidden="true" className="size-5" />
						</a>
					</nav>
				</div>
			</div>
		</div>
	);
}
