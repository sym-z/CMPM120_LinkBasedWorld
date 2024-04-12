
class Start extends Scene {
    create() {
        let data = this.engine.storyData;
        this.engine.setTitle(data.Title); 
        this.engine.addChoice("Begin the story");
        
        // This will be the core of our lock and key mechanism.
        //console.log(this.engine.hasKey);
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        
        if(locationData.Choices && locationData.Choices.length > 0) { 
            if(this.engine.hasKey && locationData.Key && locationData.Key.length > 0)
            {
                for(let opt of locationData.Key)
                {
                    this.engine.addChoice(opt.Text, opt)
                }
            }
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice); 
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice.Target == "Hot_Tub")
        {
            this.engine.show("&gt; "+ choice.Text);
            this.engine.gotoScene(Tub);
            return;
        }
        else if(choice.Target == "Key_Get")
        {
            this.engine.show("&gt; "+ choice.Text);
            this.engine.hasKey = true;
            this.engine.gotoScene(Location, choice.Target);
        }
        else if(choice) 
        {
            this.engine.show("&gt; "+ choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } 
        else 
        {
            this.engine.gotoScene(End);
        }
    }
}
// Custom Scene for Location Specific Interactive Mechanism
class Tub extends Scene
{
    create()
    {
        this.engine.gotoScene(Location, "Hot_Tub");
    }
}
class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');