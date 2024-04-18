
class Start extends Scene {
    create() {
        let data = this.engine.storyData;
        this.engine.setTitle(data.Title);
        this.engine.addChoice("Wake up.");
        this.engine.hasKey = false
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        // Store into a variable so that I do not have to write out the long name
        let locationData = this.engine.storyData.Locations[key];
        // Show the proper dialogue if the plants have already been destroyed
        if (this.engine.plants == false && locationData.Body2 && key == "Plants") {
            this.engine.show(locationData.Body2);
            if (locationData.Choices2 && locationData.Choices2.length > 0) {
                for (let choice of locationData.Choices2) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
            return;
        }
        // Show the proper dialogue if the stone has already been destroyed
        else if (this.engine.hasKey == true && locationData.Body2 && key == "Stone") {
            this.engine.show(locationData.Body2);
            if (locationData.Choices2 && locationData.Choices2.length > 0) {
                for (let choice of locationData.Choices2) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
            return;
        }
        else {
            // Standard case
            if (locationData.Choices && locationData.Choices.length > 0) {
                this.engine.show(locationData.Body);
                if (this.engine.hasKey && locationData.Key && locationData.Key.length > 0) {
                    for (let opt of locationData.Key) {
                        this.engine.addChoice(opt.Text, opt)
                    }
                }
                for (let choice of locationData.Choices) {
                    this.engine.addChoice(choice.Text, choice);
                }
            } else {
                if (locationData == this.engine.storyData.Locations["End"]) {

                    this.engine.show(locationData.Body);

                    this.engine.show(this.engine.storyData.Locations["End"].Body);

                    this.engine.gotoScene(End);

                }

                else if (locationData == this.engine.storyData.Locations["Good_End"]) {

                    this.engine.show(locationData.Body);

                    this.engine.show(this.engine.storyData.Locations["End"].Body);

                    this.engine.gotoScene(End);

                }

                else {

                    this.engine.show(locationData.Body);

                    this.engine.gotoScene(Tub);

                }
            }
        }
    }

    handleChoice(choice) {
        // Do not attempt to use the dot operator on an ending scene, so you avoid messing with undefined data members
        if (choice == this.engine.storyData.Locations["End"]) this.engine.gotoScene(End);
        else if (choice.Target == "Back_Yard") {

            this.engine.inTub = false;

            this.engine.show("&gt; " + choice.Text);

            this.engine.gotoScene(Location, choice.Target);

        }
        else if (choice.Target == "Hot_Tub") {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Tub);
            return;
        }
        // Set variable for lock and key puzzle
        else if (choice.Target == "Key_Get") {
            this.engine.show("&gt; " + choice.Text);
            this.engine.hasKey = true;
            this.engine.gotoScene(Location, choice.Target);
        }
        // Set variable for option to destroy potted plants
        else if (choice.Target == "Destroy_Plants") {
            this.engine.show("&gt; " + choice.Text);
            this.engine.plants = false;
            this.engine.gotoScene(Location, choice.Target);
        }
        // Standard case
        else if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        }
        // Sanity check for some undefined behavior
        else {
            this.engine.gotoScene(End);
        }
    }
}
// Custom Scene for Location Specific Interactive Mechanism
class Tub extends Location {
    create() {
        // Shows this text then calls the scene in the json file.

        console.log(this.engine.inTub)

        if (!this.engine.inTub) {

            this.engine.show("&gt; " + "As you enter it, the hot tub sizzles and bubbles.");

        }

        this.engine.inTub = true;

        let jetChoice = { Text: 'Activate Jets', Target: 'Jets' }

        let musicChoice = { Text: 'Turn on Music', Target: 'Music' }

        this.engine.addChoice(jetChoice.Text, jetChoice);

        this.engine.addChoice(musicChoice.Text, musicChoice);

        if (!this.engine.plants) {



            let plantChoice = { Text: 'Contemplate the similarity between the imprisonment of the plants and your theft.', Target: 'Contemplation' }

            this.engine.addChoice(plantChoice.Text, plantChoice);

        }

        this.engine.gotoScene(Location, "Hot_Tub");
    }
}
class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
        this.engine.show("&gt; " + "Thank you for playing!");
    }
}

Engine.load(Start, 'myStory.json');