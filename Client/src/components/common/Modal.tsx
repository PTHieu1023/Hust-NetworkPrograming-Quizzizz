import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'

interface ModalProps {
    children: React.ReactNode
    id?: string
    className?: string
    isOpen?: boolean
    onClose?: () => void
}

const Modal: React.FC<ModalProps> = ({
    children,
    id = 'modal',
    className = '',
    isOpen = false,
    onClose = () => {}
}) => {
    // close on click outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (isOpen && e.target === document.getElementById(id)) {
                onClose()
            }
        }

        document.addEventListener('click', handleOutsideClick)

        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    })

    // close if the esc key is pressed
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    })

    return (
        <>
            <div
                id={id}
                className={`fixed z-20 inset-0 w-full h-full  flex justify-center items-center transition-all duration-300 ${isOpen ? 'bg-black/75' : 'invisible bg-opacity-0'}`}
            >
                <div
                    className={`relative w-full max-w-xl min-h-24 max-h-80 bg-base-100 overflow-y-auto mx-6 md:mx-auto rounded-2xl shadow-lg transition-all origin-center duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100 h-fit' : 'opacity-0 scale-50'} ${className}`}
                >
                    <FontAwesomeIcon
                        onClick={onClose}
                        className="absolute top-2 right-2 w-4 h-4 p-3 text-error rounded-full cursor-pointer hover:bg-base-300 transition-all duration-100 ease-linear active:scale-90"
                        icon={faXmark}
                    />
                    {children}
                </div>
            </div>
        </>
    )
}

export default Modal
