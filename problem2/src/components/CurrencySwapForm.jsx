import { useState } from "react";
import PriceInput from "./CurrencyInput";
import { AiOutlineArrowDown } from "react-icons/ai";

const CurrencySwapForm = () => {
	const [payPrice, setPayPrice] = useState({});
	const [receivePrice, setReceivePrice] = useState({});

	console.log('payPrice', payPrice);
	console.log('receivePrice', receivePrice);

	const onSwapPayReceive = (event) => {
		event.preventDefault();
		// thực hiện logic
	};
	const handlePayPriceChange = (amount, currency) => {
		setPayPrice({ amount, currency });
	};

	const handleReceivePriceChange = (amount, currency) => {
		setReceivePrice({ amount, currency });
	};

	return (
		<div
			className="w-[400px] overflow-hidden mt-36 bg-[#131313] border border-[#ffffff12] rounded-[12px]"
			style={{
				boxShadow:
					"rgba(252, 114, 255, 0.08) 0px 0px 10px 0px, rgba(252, 114, 255, 0.18) 0px 40px 120px 0px",
			}}
		>
			<h3 className="text-2xl text-white px-4 py-2">Currency Swap</h3>
			<form className="px-4 py-2 relative" onSubmit={onSwapPayReceive}>
				<div className="mb-1.5">
					<PriceInput
						title="You pay"
						onPriceChange={handlePayPriceChange}
						value={payPrice}
					/>
				</div>
				<button
					type="submit"
					className="absolute top-[35%] left-[45%] bg-[#1b1b1b] border-[6px] rounded-[8px] border-[#131313] w-8 h-8 flex justify-center items-center mx-auto"
				>
					<AiOutlineArrowDown color="white" className="text-base" />
				</button>
				<div className="mb-1.5">
					<PriceInput
						title="You receive"
						onPriceChange={handleReceivePriceChange}
						value={receivePrice}
					/>
				</div>
				<button className="p-4 bg-[#311c31] hover:opacity-60 w-full rounded-[12px] mb-2">
					<p className="text-[#fc72ff]">Connect Wallet</p>
				</button>
			</form>
		</div>
	);
};

export default CurrencySwapForm;
