import { For } from "solid-js"

import type { Index } from "@/games/nought-and-cross/types"

type HistoryProperties = {
    history: Index[]
}
export const History = (properties: HistoryProperties) => {

    return <div>
        history

        <For each={properties.history}>
            {history => <p>{history}</p>}
        </For>
    </div>
}