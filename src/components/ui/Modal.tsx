import React from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
	if (!open) return null;
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
			<div className='bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative'>
				<button
					className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
					onClick={onClose}>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
