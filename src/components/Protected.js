import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

export default function Protected(props)
{
    const navigate = useNavigate();
    const {Cmp} = props;
    useEffect(()=>{
        let log = localStorage.getItem('user')
        if(!log)
        {
            navigate('/login')
        }
    },[])
    return(
        <Cmp />
    )
}