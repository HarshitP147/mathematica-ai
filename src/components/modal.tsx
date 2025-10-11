'use client'

import { motion } from "motion/react"

export default function Modal() {
    {/* Open the modal using document.getElementById('ID').showModal() method */ }
    return (
        <motion.dialog animate initial={{ x: '-100%' }} exit={{ x: 0 }} id="my_modal_2" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </motion.dialog>
    )
}