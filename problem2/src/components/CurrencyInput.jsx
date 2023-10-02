import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineCheck } from "react-icons/ai";

const PriceInput = ({ title = "", value = 0, onPriceChange }) => {
	const [amount, setAmount] = useState(0);
	const [tokenValue, setTokentValue] = useState({img: "", name: "", price: 0,});
	const [isOpen, setIsOpen] = useState(false);
	const cancelButtonRef = useRef(null);
	const [tokenIcons, setTokenIcons] = useState([]);
	const [tokenData, setTokenData] = useState([]);
	const [filterData, setFilternData] = useState([]);
	
	useEffect(() => {
		onPriceChange(amount, tokenValue.price);
	}, [tokenValue.price]);
	// fetch and init data token and icon
	useEffect(() => {
		async function fetchTokenIcons() {
			try {
				const response = await axios.get(
					"https://api.github.com/repos/Switcheo/token-icons/contents/tokens"
				);

				if (response.status === 200) {
					const files = response.data;
					setTokenIcons(files);
				} else {
					console.log("Error get token icons");
				}
			} catch (error) {
				console.error(error);
			}
		}
		fetchTokenIcons();

		async function fetchTokenData() {
			try {
				const response = await axios.get(
					"https://interview.switcheo.com/prices.json"
				);

				if (response.status === 200) {
					const data = response.data;
					setTokenData([...new Set(data)]);
				} else {
					console.log("Error get token data");
				}
			} catch (error) {
				console.error(error);
			}
		}
		fetchTokenData();
	}, []);
	// handel filter 
	const handleInputFilter = (value) => {
    let valueInput = value.toLowerCase()
    setFilternData([...tokenData.filter((item) => item.currency.toLowerCase().includes(valueInput))])
  }

	return (
		<div className="bg-[#1b1b1b] rounded-[12px] shadow-none p-4">
			<h4 className="text-[#939393] text-left">{title}</h4>
			<div className="flex justify-between">
				<input
					className="text-[#9b9b9b] bg-inherit outline-none text-4xl w-2/3"
					placeholder="0"
					value={value || amount}
					onChange={(e) => setAmount(e.target.value)}
					name="amount"
					pattern="^[0-9]*[.,]?[0-9]*$"
					maxLength="79"
					minLength="1"
				/>
				<div className="">
					{tokenValue.price !== 0 ? (
						<div
							onClick={() => setIsOpen(true)}
							className="bg-[#131313] flex items-center font-semibold text-[#ffffff] py-1 px-2 rounded-[16px] cursor-pointer"
						>
							<img
								src={tokenValue.img}
								alt=""
								className="w-5 h-5"
							/>
							<p className="ml-2">{tokenValue.name}</p>
						</div>
					) : (
						<p
							onClick={() => setIsOpen(true)}
							className="bg-[#fc72ff] border border-[#fc72ff] font-semibold text-[#ffffff] py-1 px-1.5 rounded-[16px] cursor-pointer"
						>
							Select Token
						</p>
					)}
				</div>
			</div>
			<div className="h-4"></div>

			{/* modal select token */}
			<Transition.Root
				show={isOpen}
				as={Fragment}
				initialFocus={cancelButtonRef}
			>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setIsOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-[#00000099] bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
						<div className="flex min-h-full items-end justify-center  p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-[20px] bg-[#131313] text-left shadow-xl transition-all !w-[400px]">
									<div className="bg-[#131313] p-5">
										<div className="">
											<div className="mt-3 text-center">
												<Dialog.Title
													as="h3"
													className="text-base font-semibold leading-6 text-white"
												>
													<div className="flex justify-between pb-5">
														<p>Select a token</p>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="24"
															height="24"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="components__CloseIcon-sc-86af9f3-0 kAQKsL cursor-pointer"
															onClick={() =>
																setIsOpen(false)
															}
														>
															<line
																x1="18"
																y1="6"
																x2="6"
																y2="18"
															></line>
															<line
																x1="6"
																y1="6"
																x2="18"
																y2="18"
															></line>
														</svg>
													</div>
												</Dialog.Title>
												<div className="mt-2 flex bg-[#1b1b1b] border border-[#ffffff12] w-full px-3 py-2 items-center mb-5 rounded-[24px]">
													<HiMagnifyingGlass className="text-white text-xl mr-2" />
													<input
														type="text"
														className="bg-inherit px-2 w-full outline-none text-white"
														placeholder="Search name or paste address"
														onChange={e => handleInputFilter(e.target.value)}
													/>
												</div>
												<div className="my-2 border-t border-[#ffffff12]"></div>
												{/* list token */}
												<div className="h-80 overflow-y-scroll">
													{(filterData.length !== 0 ? filterData : tokenData).map(
														(item, index) => {
															const matchingIcons =
																tokenIcons.filter(
																	(icon) => {
																		const nameWithoutExtension =
																			icon.name.replace(
																				/\.[^.]+$/,
																				""
																			);
																		return (
																			nameWithoutExtension.toLowerCase() ===
																			item.currency.toLowerCase()
																		);
																	}
																);
															if (
																matchingIcons.length ===
																0
															) {
																return null;
															}
															return (
																<div
																	key={index}
																>
																	{matchingIcons.map(
																		(
																			icon,
																			index
																		) => (
																			<div
																				key={
																					index
																				}
																				onClick={() => {
																					setTokentValue(
																						{
																							img: icon.download_url,
																							name: item.currency,
																							price: item.price,
																						}
																					);
																					setIsOpen(
																						false
																					);
																				}}
																				className='flex items-center hover:bg-[#98a1c014] pl-2 py-3 cursor-pointer'
																			>
																				<img
																					src={
																						icon.download_url
																					}
																					alt=""
																					className="w-9 h-9"
																				/>
																				<div>
																					<p className="text-white ml-5">
																						{
																							item.currency
																						}
																					</p>
																				</div>
																				<div className={`${tokenValue.price === item.price ? 'inline-block text-[#fc72ff] text-base ml-auto mr-4'  : 'hidden'}`}><AiOutlineCheck/></div>
																			</div>
																		)
																	)}
																</div>
															);
														}
													)}
												</div>
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</div>
	);
};

export default PriceInput;
