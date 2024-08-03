'use client'

import BoardGame from "@/components/board";
import GameSetting from "@/components/form/GameSetting";
import { useState } from "react";

export default function GamePage() {

    const [settingsOn, setSettingsOn] = useState(true); 

    return <div>
        {settingsOn ? <GameSetting setSettingsOn={setSettingsOn}/>
        : <BoardGame />
        }
    </div>;
}