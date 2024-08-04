import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumnIcon } from "lucide-react";
import LeaderBoardShow from "./leader-board-show";

export default async function LeaderBoard() {
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="border-none"><ChartNoAxesColumnIcon />Leaderboard</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[400px]">
            <DialogHeader>
                <DialogTitle className="flex text-2xl gap-3 justify-center items-center"><h2>Leader Board</h2> <ChartNoAxesColumnIcon/></DialogTitle>
            </DialogHeader>
                <LeaderBoardShow/>
        </DialogContent>
    </Dialog>
}
