'use client'

import BoardGame from "@/components/board";
import Game from "@/components/common/Game";
import GameSetting from "@/components/form/GameSetting";
import { useState } from "react";

export default function GamePage() {

    const [settingsOn, setSettingsOn] = useState(true); 
    const [botPath, setBotPath] = useState<number[][] | null>(null);

    return <div>
        {settingsOn ? <GameSetting setSettingsOn={setSettingsOn}/>
        : <Game setSettingsOn={setSettingsOn}/>
        }
    </div>;
}