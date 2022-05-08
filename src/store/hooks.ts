import {TypedUseSelectorHook, useSelector} from 'react-redux'
import {ReduxState} from "./store";

// Used instead of plain `useDispatch` and `useSelector`
// export const useReduxDispatch = () => useDispatch<ReduxDispatch>()

export const useReduxSelector: TypedUseSelectorHook<ReduxState> = useSelector
