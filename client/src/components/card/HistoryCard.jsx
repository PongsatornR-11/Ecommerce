import React from 'react'

const HistoryCard = () => {
    return (
        <div>
            <h1 className='text-2xl font-bold'>Order History</h1>

            {/*container */}
            <div>
                {/* card loop order */}
                <div className='bg-gray-100 p-4 rounded-md shadow-md my-1'>
                    {/* header */}
                    <div className='flex justify-between'>
                        <div>
                            <p className='text-sm'>Order date</p>
                            <p className='font-bold'>Jan15'2025</p>
                        </div>
                        <div>
                            status
                        </div>
                    </div>

                    {/* table  loop product*/}
                    <div>
                        <table className='border w-full '>
                            <tr className='bg-gray-200'>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                            <tr>
                                <td>RTX 4060</td>
                                <td>14,500</td>
                                <td>1</td>
                                <td>14,500</td>
                            </tr>
                        </table>
                    </div>
                    {/* total */}
                    <div>
                        <div className='text-right'>
                            <p>Total Price</p>
                            <p>50,000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryCard