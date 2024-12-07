
import { useEffect, useState } from 'react'
import { getChannelListAPI } from '../apis/article'
const useChannel = () => {
    const [channelList, setChannelList] = useState([])

    useEffect(() => {
        getChannelListAPI().then(res => {
            setChannelList(res.data.channels)
        })
    }, [])

    return {
        channelList
    }
}

export { useChannel }
