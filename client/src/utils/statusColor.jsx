export const getStatusColor = (status) => {
    switch (status) {
        case 'Not Process':
            return 'bg-red-400'
        case 'Processing':
            return 'bg-yellow-400'
        case 'Dispatched':
            return 'bg-blue-400'
        case 'Cancelled':
            return 'bg-gray-400'
        case 'Completed':
            return 'bg-green-400'
        default:
            return ''
    }
}