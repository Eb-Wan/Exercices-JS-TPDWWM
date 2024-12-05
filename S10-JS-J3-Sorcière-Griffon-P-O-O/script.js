class GameManager {
    constructor () {
        this.Players = [];
        this.InGame = true;
        this.NextPlayer = 0;
        this.HasFought = false;
        this.LastPlayerId = 0;
    }
    Update() {
        let ThisPlayer = this.Players[this.NextPlayer];
        ThisPlayer.Move();
        if (this.Players[0].Position >= this.Players[1].Position && this.HasFought == false) {
            ThisPlayer.MoveTo(this.Players[this.LastPlayerId].Position);
            let Result = ThisPlayer.Fight(this.LastPlayerId);
            this.Players[Result[0]].Move(Result[1]);
            if (this.Players[0].Position > this.Players[1].Position) this.HasFought = true;
        }
        if (ThisPlayer.CheckWin()) {
            this.End(ThisPlayer.Name);
        }
        this.NextPlayer++;
        if (this.NextPlayer == this.Players.length) this.NextPlayer = 0;
        if (this.InGame) this.Update();
    }
    End(Name) {
        console.log(Name, "à gagné !")
        this.InGame = false;
    }
}

class Player {
    constructor (Id, Name, StartPos, EndPos, Direction) {
        this.Id = Id;
        this.Name = Name;
        this.Position = StartPos;
        this.EndPos = EndPos;
        this.Direction = Direction;
    }
    CheckWin() {
        if (this.Direction > 0) return (this.Position >= this.EndPos) ? true : false;
        else if (this.Direction < 0) return (this.Position <= this.EndPos) ? true : false;
        else return false;
    }
    Move(Ammount) {
        Ammount = this.Direction * (Ammount != undefined) ? Ammount : this.RandomRange(1,6) * this.Direction;
        this.Position += Ammount;
        console.log(this.Name,"a avancé de", Ammount,"case, et est en", this.Position+".");
    }
    MoveTo(Position) {
        this.Position = Position;
    }
    RandomRange(min, max) { return Math.round((Math.random() * (max - min)) + min)};
}

class Witch extends Player {
    constructor (Id, Name, StartPos, EndPos, Direction) {
        super(Id, Name, StartPos, EndPos, Direction);
    }
    Fight (With) {
        console.log ("Le griffon et la sorcière, sont en train de se marraver en case", this.Position, ", la sorcière tire une carte!");
        if (super.RandomRange(1,2) == 1) {console.log ("La sorcière est passé par dessus le griffon!"); return ([this.Id, 1])}
        else {console.log ("La sorcière a tabassé le griffon!"); return ([With, -2])}
    }
}
class Griffin extends Player {
    constructor (Id, Name, StartPos, EndPos, Direction) {
        super(Id, Name, StartPos, EndPos, Direction);
    }
    Fight (With) {
        console.log ("Le griffon attaque la sorcière en case", this.Position, "!");
        if (super.RandomRange(1,2) == 1) {
            if (super.RandomRange(1,2) == 1) {console.log ("La sorcière est passé par dessus le griffon!"); return ([With, 1]);}
            else {console.log ("La sorcière a tabassé le griffon!"); return ([With, 2]);}
        } else console.log ("Put1, il est fort ce con!"); return ([With, -2]);
    }
}

const GameManagerInstance = new GameManager();
GameManagerInstance.Players.push(new Witch(0, "La sorcière", 0, 51, 1));
GameManagerInstance.Players.push(new Griffin(1, "Le griffon", 50, 0, -1));
GameManagerInstance.Update();