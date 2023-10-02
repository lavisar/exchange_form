import "./App.css";
import CurrencySwapForm from "./components/CurrencySwapForm";

function App() {
	return (
		<div className="App bg-[#131313] h-screen">
			{/* <SwapForm/> */}
			<div className="w-full flex justify-center">
				<CurrencySwapForm />
			</div>
		</div>
	);
}

export default App;
