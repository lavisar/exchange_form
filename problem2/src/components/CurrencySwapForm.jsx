import { useEffect, useState } from "react";
import PriceInput from "./CurrencyInput";
import { AiOutlineArrowDown } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";

const CurrencySwapForm = () => {
	const [payPrice, setPayPrice] = useState({});
	const [receivePrice, setReceivePrice] = useState({});

	const [calculatedPayPrice, setCalculatedPayPrice] = useState(0);
	const [calculatedReceivePrice, setCalculatedReceivePrice] = useState(0);

	useEffect(() => {
		if (payPrice.amount > 0 && payPrice.currency > 0 && receivePrice.currency > 0) {
			setCalculatedReceivePrice((payPrice.amount * payPrice.currency / receivePrice.currency).toFixed(8))
		} else if (receivePrice.amount > 0 && receivePrice.currency > 0 && payPrice.currency){
			setCalculatedPayPrice((receivePrice.amount * receivePrice.currency / payPrice.currency).toFixed(8))
		}
	}, [payPrice.amount, payPrice.currency, receivePrice]);

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
			<div className="flex items-center justify-between px-5 pt-2">
			<p className="text-xl text-white">Swap</p>
			<IoMdSettings className="text-2xl text-[#8f8888] cursor-pointer"/>
			</div>
			<form className="px-4 py-2 relative" onSubmit={onSwapPayReceive}>
				<div className="mb-1.5">
					<PriceInput
						title="You pay"
						value={calculatedPayPrice}
						onPriceChange={handlePayPriceChange}
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
						value={calculatedReceivePrice}
						onPriceChange={handleReceivePriceChange}
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
