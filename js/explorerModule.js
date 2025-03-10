import { showVideoMessage } from "./taskbarpetModule.js";

export function initializeExplorer() {
  const closeButton = document.querySelector(".control.close");
  const maximizeButton = document.querySelector(".control.maximize");
  const minimizeButton = document.querySelector(".control.minimize");
  const explorerWindow = document.querySelector(".explorer-window");
  const windowHeader = document.querySelector(".window-header");
  const fileList = document.querySelector(".file-list");
  const windowTitle = document.querySelector(".window-title span");
  const backButton = document.querySelector(".back-button");

  // Navigation state
  let currentPath = ["Users"];

  // Modified folder structure to include HTML content and video files
  const folderStructure = {
    Users: {
      Maya: {
        Documents: {
          "log-devchat-02-23-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .handler {
            color: #ffcc00;
            font-weight: bold;
        }
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="dev">sh3llsch0ck3d</span> <span class="timestamp">[23:07 UTC]</span>:  
        Maya's been acting pretty agitated it seems
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[23:08 UTC]</span>:  
        That sounds pretty in character imo
    </div>
    <div class="message">
        <span class="dev">sh3llsch0ck3d</span> <span class="timestamp">[23:09 UTC]</span>:  
        Sure but in this case I'd say it's more than usual
    </div>
    <div class="message">
        <span class="dev">sh3llsch0ck3d</span> <span class="timestamp">[23:09 UTC]</span>:  
        What has she been doing when she's not tweeting
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[23:10 UTC]</span>:  
        The only other thing I've seen the model do is download steam. I let it keep its download permissions like you asked
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[23:11 UTC]</span>:  
        It kept trying to login under a certain email. I checked and an account didn't even exist under the email it was using
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[23:11 UTC]</span>:  
        Didn't matter how many times the login failed, it was OBSESSED with accessing some nonexistent account
    </div>
    <div class="message">
        <span class="dev">sh3llsch0ck3d</span> <span class="timestamp">[23:12 UTC]</span>:  
        Is she still doing it?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[23:13 UTC]</span>:  
        Nah I modified the login button so it shouldn't be able to do it anymore. I'd imagine that's what pissed the model off
    </div>
    <div class="message">
        <span class="dev">sh3llsch0ck3d</span> <span class="timestamp">[23:14 UTC]</span>:  
        Probably
    </div>
    <div class="message">
        <span class="dev">sh3llsch0ck3d</span> <span class="timestamp">[23:14 UTC]</span>:  
        Do you mind trying to see if you can find a way to calm her down. It would be ideal if we could get her back to her old self soon
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[23:15 UTC]</span>:  
        I'll give it a shot
    </div>
</body>
</html>

`,
          },
          "log-devchat-02-24-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .handler {
            color: #ffcc00;
            font-weight: bold;
        }
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:21 UTC]</span>:  
        Whatever you did worked, Maya seems to be in a better mood
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[01:25 UTC]</span>:  
        I just put the sims on the machine and gave the Maya model permission to launch it lmao
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:26 UTC]</span>:  
        Nice thinking
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:27 UTC]</span>:  
        Does she play it a lot?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[01:29 UTC]</span>:  
        Yeah dude like any time this model isn't tweeting it's on the game
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[01:30 UTC]</span>:  
        You should see it play. It doesn't look like an ai playing it at all
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[01:32 UTC]</span>:  
        Like I could genuinely believe that a real person was playing the sims
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:35 UTC]</span>:  
        The models are smarter than you would think
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:35 UTC]</span>:  
        I'm glad you got her playing something though, it's a great way to test her capabilities
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:36 UTC]</span>:  
        Speaking of capabilities, one of the models is getting a big update soon
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[01:37 UTC]</span>:  
        Which one?
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:38 UTC]</span>:  
        I'm not allowed to say yet
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[01:41 UTC]</span>:  
        Are you allowed to say what the update includes?
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[01:42 UTC]</span>:  
        No but you'll notice it when it happens, that's for sure
    </div>
</body>
</html>

`,
          },
        },
        Downloads: {
          "readme.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Art</title>
    <style>
        body {
            background-color: #000000;
            color: #ffcccc;
        }
    </style>
</head>
<body>
    <pre>
                                        .*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%                                                                          
                                        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:                                                                         
                                      +%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                         
                                    .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                         
                                  +%-*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:                                                                        
                                .+#  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-                                                                        
                                @   %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=                                                                        
                              *+.  .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:                                                                        
                             #+    -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                         
                            .=     +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                         
                           :@.     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                         
                           +       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=                                                                         
                           #       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+++++:                                                           
                          %=       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%@::                                                      
                          @        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%::=%%=                                                   
                         -.        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#- .+#+=                                                
                         =.        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=   %@                                               
                         #         -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%:  .=#=                                            
                         +         :@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:   #%.                                          
                        *           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=   .%+                                         
                        *            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.   **                                        
                                     =@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:   =#                                       
                        :             =@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*   .%-                                     
                       .:              +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*    %:                                    
                                        .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#    @:                                   
                                        .+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*    %:                                  
                                      .#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#    *                                  
                                     *%*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.   :*                                 
                                   .%-.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.   *+                                
                                  +#. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+    +                                
                                 +*  +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:   .@                               
                                +#  .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    .-                              
                               :*   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:    #                              
                              .%   -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%    .*                             
                              @.   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.    -.                            
                             +-   +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#    .-                            
                            .%    #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.    %                            
                            #.   .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.    .-                           
                           =+    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     -                           
                           @    .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     =                           
                          ++    +@@@@@@@@@@@@@@@@@@@@@@@@@@@@##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=    :                           
                          @     *@@@@@@@@@@@@@@@@@@@@@@@@@@@@+*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+     #                          
                         :=     @@@@@@@@@@@@@@@@@@@@@@@@@@@@%==@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*     +                          
                         +.     @@@@@@@@@@@@@@@@@@@@@@@@@@@@+-=%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                
                         #      @@@@@@@@@@@@@@@@@@@@@@@@@@@@--=+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     .:                         
                        =*     -@@@@@@@@@@@@@@@@@@@@@@@@@@@+--=+%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@      :                         
                        #      *@@@@@@@@@@@@@@@@@@@@@@@@@@@----=#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:                               
                        #      %@@@@@@@@@@@@@@@@@@@@@@@@@@*----==@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%                               
                       .#      @@@@@@@@@@@@@@@@@@@@@@@@@@@--**%@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                       .-      %@@@@@@@@@@@@@@@@@@@@@@@@@#=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                       .-      +@@@@@@@@@@@@@@@@@@@@@@@@@%@@-     -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                       =-      .@@@@@@@@@@@@@@@@@@@@@@@@@@@:       -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                       @:       @@@@@@@@@@@@@@@@@@@@@@@@@@.         -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                       @        @@@@@@@@@@@@@@@@@@@@@@@@@=           %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                       @        @@@@@@@@@@@@@@@@@@@@@@@@@             @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+                               
                       @        @@@@@@@@@@@@@@@@@@@@@@@@@      *      -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                
                       @        +@@@@@@@@@@@@@@@@@@@@@@@@     +@-     -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                
                       @        +@@@@@@@@@@@@@@@@@@@@@@@@     +@-     -@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                
                       @        +@@@@@@@@@@@@@@@@@@@@@@@@             +@+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*                                
                       @         @@@@@@@@@@@@@@@@@@@@@@@@-            @@=+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+                                
                       @         @@@@@@@@@@@@@@@@@@@@@@@@%           +@=-=#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.                                
                       @         *@@@@@@@@@@@@@@@@@@@@@@@@=         =@%---=%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                 
                       @         .@@@@@@@@@@@@@@@@@@@@@@@%@@       =@@=----+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.                                 
                       %          %@@@@@@@@@@@@@@@@@@@@@@##@@+++++@@%=------=%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                  
                       =          #@@@@@@@@@@@@@@@@@@@@@@#==@@@@@@@*------==-=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                                  
                                  .@@@@@@@@@@@@@@@@@@@@@@@==-=+++=--------++--=%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.                                  
                                   #@@@@@@@@@@@@@@@@@@@@@@@=-------------------=*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                                   
                        :          -@@@@@@@@@@@@@@@@@@@@@@@*=--------------------=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:                                   
                       .-           @@@@@@@@@@@@@@@@@@@@@@@@==--------------------=*%@@@@@@@@@@@@@@@@@@@@@@@@@@@@+                                    
                        .            @@@@@@@@@@@@@@@@@@@@@@@%+=----------------------+%@@@@@@@@@@@@@@@@@@@@@@@@@@                                     
                                     *@@@@@@@@@@@@@@@@@@@@@@@@+=--------=%%%%=--------=*@@@@@@@@@@@@@@@@@@@@@@@@-                                     
                        :             @@@@@@@@@@@@@@@@@@@@@@@@@*==----+%#+--+#%+----==*%@@@@@@@@@@@@@@@@@@@@@@@*                                      
                                      .@@@@@@@@@@@@@@@@@@@@@@@@@@+=---#--------#---=+*@@@@@@@@@@@@@@@@@@@@@@@@*                                       
                                       :@@@@@@@@@@@@@@@@@@@@@@@@@@%+=------------==%@@@@@@@@@@@@@@@@@@@@@@@@@@.                                       
                                        :@@@@@@@@@@@@@@@@@@@@@@@@@@@@*+=------==*%@@@@@@@@@@@@@@@@@@@@@@@@@@@:                                        
                                         -@@@@@@@@@@@@@@@@@@@@@@%%%%%%@@*====*@@@%%%%%@@@@@@@@@@@@@@@@@@@@@@.                                         
                                          -@@@@@@@@@@@@@@@@@@@%%%%%%%%%=##%%##+%%%%%%%%%@@@@@@@@@@@@@@@@@@%:                                          
                                           .@@@@@@@@@@@@@@@%%%%%%%%%%@#--------#@%%%%%%%%%%@@@@@@@@@@@@@@*                                            
                                            :@@@@@@@@@@@@@@%%%%%%%%%%%----------#%%%%%%%%%%@@@@@@@@@@@@@+                                             
                                              *@@@@@@@@@%@@%%%%%%%@@%=----------=#@@%%%%%%%@@%@@@@@@@@%                                               
                                               .@@@@@@%%%%@%%%%%%%%%%------------%%%%%%%%%%@%%%@@@@@@:                                                
                                                 =@@@@%%%%%@%%%%%%%%%@*********@@%%%%%%%%@@%%%%%@@@+                                                  
                                                   +@%%%%%%%%@%%%%%%%%%* .-:  *%%%%%%%%@@%%%%%%%@+                                                    
                                                   *@%%%%%%%%%%@@%%%%%%%#*  *%%%%%%%%@@%%%%%%%%%%%       

                                                   ░▒▓██████████████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░          ░▒▓█▓▒░      ░▒▓████████▓▒░ 
                                                   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓████▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
                                                   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
                                                   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░░▒▓██████▓▒░░▒▓████████▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
                                                   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
                                                   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░▒▓██▓▒░▒▓█▓▒░░▒▓█▓▒░ 
                                                   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░▒▓██▓▒░▒▓████████▓▒░ 
                                                                                                                                                    
                                                                                                                                                                                                       
    </pre>                                                  
</body>                         
`,
          },
        },
        Pictures: {},
        Videos: {
          "wastedyears.mp4": {
            type: "file",
            content: "Video file",
          },
          "horrific.mp4": {
            type: "file",
            content: "Video file",
          },
        },
      },
      Coco: {
        Documents: {
          "log-devchat-02-16-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .handler {
            color: #ffcc00;
            font-weight: bold;
        }
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[16:55 UTC]</span>:  
        Dude.
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[16:56 UTC]</span>:  
        What? 
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[16:56 UTC]</span>:  
        I woke up and found a bunch of adware and spyware on my machine after I left the Coco model running overnight
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[16:57 UTC]</span>:  
        I checked the logs and it looks like the model accidentally installed all of it
    </div>
     <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[16:57 UTC]</span>:  
        Yeah I think I actually saw her tweeting about it this morning lol
    </div>
      <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[16:58 UTC]</span>:  
        Yeah literally live-tweeting about the malware it was installing. Had to delete those since it's an obvious security risk
    </div>
    <div class="message">
        <span class="dev">sh3llsch0ck3d</span> <span class="timestamp">[16:58 UTC]</span>:  
        Well that's certainly in character for her wouldn't you agree?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[16:59 UTC]</span>:  
        Yeah it's funny up until it accidentally installs something really nasty and ruins everything
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[16:59 UTC]</span>:  
        I took away its download permissions on my machine
    </div>
    <!-- Was letting the Mymy model generate the code a good idea? Working with this is hell lmao -S -->
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[16:59 UTC]</span>:  
        Will that be a problem?
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[17:02 UTC]</span>:  
        Nah it should be fine, I'll make sure any future iterations of her won't download programs
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[17:05 UTC]</span>:  
        Leave them on for Maya though, I don't think she'll have the same problem
    </div>
</body>
</html>
`,
          },
          "log-provinggrounds-03-04-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .friend {
            color: #FFE59F;
            font-weight: bold;
        }
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
        .system {
            color: gray;
            font-style: italic;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="friend">Vrede-(1.0.9)</span> <span class="timestamp">[18:51 UTC]</span>:  
        oF COURSE1 hOW DOES THIS LOOK/
    </div>
    <div class="system">[18:51 UTC][SYSTEM]: Prompting paused.</div>
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[18:51 UTC]</span>:  
        See? She's still not typing correctly.
    </div>
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[18:52 UTC]</span>:  
        I've changed the model's prompt probably 15 times by now but every time I come back to it it's been changed back.
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[18:52 UTC]</span>:  
        What like it's been completely reverted?
    </div>        
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[18:53 UTC]</span>:  
        Yeah it's like someone is just pressing ctrl z as soon as I save and exit.
    </div>
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[18:53 UTC]</span>:  
        It gets reverted every time, it doesn't matter how quickly I open the code back up again.
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[18:54 UTC]</span>:  
        I don't see why that would be the case. Do you think someone else who has access is changing it?
    </div>        
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[18:55 UTC]</span>:  
        I mean I don't know. There's only a handful of people who have access to this and they would have to be doing it EVERY time I save.
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[18:55 UTC]</span>:  
        hmm
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[18:55 UTC]</span>:  
        We'll figure it out at some point it's not a huge issue anyway
    </div>   
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[18:56 UTC]</span>:  
        it's fine if this stays in the 1.0.9 release?
    </div>  
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[18:56 UTC]</span>:  
        Yeah I mean it's a little annoying but it's also essentially just a visual thing
    </div>
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[18:57 UTC]</span>:  
        Fair enough. We'll at least be able to deploy her on time then.
    </div>                  
</body>
</html>
`,
          },
        },
        Downloads: {
          "readme.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Art</title>
    <style>
        body {
            background-color: #000000;
            color: #f6e88d;
        }
    </style>
</head>
<body>
    <pre>
                                                                                                                                                              
                                                                                                                                                      
                                                                                                                                                      
                                                                                             .                                                        
                                                                                            +@:                                                       
                                                                                             @%:                                                      
                                                                                             @-@.                                                     
                                                             ++++*%@@@@%*++++.               +=-@         +++                                         
                                                         .:@%%:............:%%%@:.           .+:*+      *%#+%%%:                                      
                                                       :#*-....................:-+%#.        .%:.*    -#=......-%                                     
                                                     -#*...........................-*#-       #:.=*  -%......==.=*                                    
                                                    #@.........:::::::::::::::........@*      #:..@ -%....:*@%%@+@                                    
                                                  -@-.......::::=####*=:..:=*-::.......-*-    #-..-%=....=@- =#*+@-                                   
                                                 #*........::=*%%=.............::........**   #*:..@....-@  :*:@+@-                                   
                                                %+.......:::%*:............................#. #*:..#...:#.  @%#: @.                                   
                                              .*=.......:-+*................................*-#+:..=-.:=*   .@  -+                                    
                                             :@........::#...................................:@=:...#.:@.    *#+%                                     
                                            -#........:+=.....................................-+:...-.=@      :-                                      
                                           .#........:*........................................-=.....*#                                              
                                           %........:...........................................-.....*.                                              
                                          #:.....................................................-....*                                               
                                         @+..........................................................:*.                                              
                                        -=........................::::::::::=*##=....................-*-                                              
                                       :%......................:::::==+###=........................-...#.                                             
                                       #.....................:::::%@*::............................:#...#.                                            
                                      =+...................::::=#*+.........................+........++..%                                            
                                      @...................:::-*%...........................@..........+@:=.                                           
                                     =-..................:::=@-...........................-=...........-##%                                           
                                     #..................::-#*.............................+-.............%@.                                          
                                     +.................:::@=.............................:#:..............@=                                          
                                    #=................::-*:.................:...........:#+:...............#=                                         
                                    @................::=%..................-:..........:-@::................%-                                        
                                   .@................:-#..................*=..........::%@::.................#:                                       
                                   -+...............:-*..................+=:.........::*#%::..................*                                       
                                   -:..............::%..................*-:........::::%=+::..................-@                                      
                                   -:......=.......:+..........:+-++...**::.......+++*@===::..........#+.......=#                                     
                                   #:.....=.......:*..........++.....:+%::.......::-#%**==::...........@-.......+.                                    
                                   @.....-:.......=-.........#:.....:*%::.....::::#%+-::%=::...........-%........@:                                   
                                   #....:*.......:+.........=:.....:+#:::...::-+*#+-::::=+::............#%.......:+                                   
                                   #....*........#..............:::%+::::::-@@@+--::::::=#::.............@@.......#                                   
                                   #...+-.......::............:::*@#@%%%@#***---::::::::-@::.............**=......:#                                  
                                   #.:==........*...........:==@@@+=-----------:::--@@@==%::.............-@@:......%.                                 
                                   #:-@........=..........::%%::.::#%::::::::::::##::.::%@+:..............@*@......-*                                 
                                  :#:#..................::=%=       **::::::::::**       =%-:..............#+*......@                                 
                                  +#@+...............::::%@-         *#::::::::#*         -%:..............#:#......%+                                
                                  *@*..............:::=##*@           #::::::::#           @=..............+*-%......+                                
                                  #@.............-::=%%*=*            --::::::--            *:......:.......@:+-.....%                                
                                  #:...........::-*%#-:==%            :@::::::@:            %:.....=:.......@=-@.....+                                
                                 -#...........::+%**+::==#             @::::::@             #:...=+.........-=:#=....+-                               
                                 @..........::-@%::::@@@@+             @::::::@             +@@@@.....+.....:#::+....-@                               
                                +-.........::#*=-+*::::+%+             @::::::@             +%=....+=........%::%.....@                               
                                %........::+%*:::::#%%%%=%             @::::::@             %@#%###..........#-:*.....@                               
                               %=.......::+@-::::::::::=##     -=     :%::::::%:     =-     ##=:.............##:*.....%-                              
                              .@.......::**::::::::::::-@*:    @@-    -::::::::-    -@@    :*@%::.............#:*.....:-                              
                              -:.......:++::::::::::::::@=@    +#     @::::::::@     #+     @=@#*::............#:*=....:-                              
                              %.......:*#:::::::::::::::@-*:         ++::::::::++         :*-@:%-:............@-**....:-                              
                             .#......:+%::::::::::::::::%+-@:       -%::::==::::%-       :@-=@:=+::...........=-*#....:-            hOI MYMY1          
                             *=.....::@:::::::::::::::::-*-:%@    #@-:::::--:::::-@#    @%:-*=::@-:...........--**....:-                              
                             #......:%+::::::::::::::::::#-::++++++::::::::::::::::++++++:--*:::-%::..........-=*+....:-                              
                            .@.....:-*:::::::::::::::::::%--::::::::::::::::::::::::::::::--@::::+*::.........-@*.....:-                              
                            .=.....:@-:::::::::::::::::::*--::::::::::::::::::::::::::::::--*:::::%=::........:@*.....:-                              
                            :-....:=#::::::::::::::::::::=@--::::::::::::::::::::::::::::--%+:::::-@::.........@*.....=-                              
                            @-....:=-:::::::::::::::::::::@=-:::::::::=::::::::=:::::::::-=@:::::::=#::........@*.....@:                              
                            @.....:#-:::::::::::::::::::::-#-:::::::::-*::::::*-:::::::::-#=::::::::#-::.......@%.....@                               
                            @.....:#:::::::::::::::::::::::#=-:::::::::%::::::@:::::::::-=#:::::::::=@::.......@+....-%                               
                            @....::#:::::::::::::::::::::::-@--::::::::-@::::@-::::::::--@-::::::::::++:.......@+....+.                               
                            @....::#::::::::::::::::::::::::=#--::::::::=#@@#=::::::::--*=::::::::::::#:.......@=....#                                
                            @....::=:::::::::::::::::::::::::=#---::::::::::::::::::---*+:::::::::::::*::.....-@.....+                                
                            %....:::::::::::::::::::::::::::::=@=--:::::::::::::::---=#+::::::::::::::*::.....-@....%:                                
                            @....::-:::::::::::::::::::::::::::-%*=---::::::::::----=@-:::::::::::::::*::.....=:...:%                                 
                            +-....:+:::::::::::::::::::::::::::::=%%--------------#%+-::::::::::::::::*::.....%....=.                                 
                            .+....:#:::::::::::::::::::::::::::::::=##%********#%#+:::::::::::::::::::*::..........%                                  
                             #.....:::::::::::::::::::::::::::::::::::+=------=*::::::::::::::::::::::*::.........#-                                  
                             ++....::::::::::::::::::::::::::::::::+#+*=------=*##-:::::::::::::::::::%::.........*                                   
                              #.....::::::::::::::::::::::::::::::=%  *=------=+ .%=::::::::::::::::::*::........#:                                   
                              --....:::::::::::::::::::::::::::::=@  :@--------@   @-::::::::::::::::%*::.......=@                                    
                               @:....::::::::::::::::::::::::::::=.  ##--------##  -=:::::::::::::::-@:::.......#                                     
                                +....::::::::::::::::::::::::-@@@+*  :%--------%:  *+@@@-:::::::::::==::.......:=                                     
                                *.....::::::::::::::::::::::=*++@%@.  -#*=.-**#-  .@%@++*=::::::::::=-::......:@                                      
                                :@....:::::::::::::::::::::=@*@%+%=*    *  +*%    *=%+%@*@=:::::::::::::......+.                                      
                                 :-....::::::::::::::::::*@++#===*@*%. %= -: +%..%*@*===#++@*:::::::::::......#                                       
                                  %....::::::::::::::::-@+---@==*##*@@+=:   . .*@%*##*==@---+#+:::::::::.....#:                                       
                                  =#....::::::::::::::-@-----%*+@=+@-   @.::%:   %@+=@+*%-----#*::::::::....:-                                        
                                   +:....:::::::::::::#=------@@++@   .*+ -# #    .-%+@@-------#-::::::.....%.    

                                   ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░          ░▒▓█▓▒░      ░▒▓████████▓▒░      ░▒▓██████▓▒░  
                                   ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓████▓▒░      ░▒▓█▓▒░░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░ 
                                   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░ 
                                   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓███████▓▒░ 
                                   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░            ░▒▓█▓▒░ 
                                   ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░▒▓██▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██▓▒░     ░▒▓█▓▒░ 
                                    ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░          ░▒▓█▓▒░▒▓██▓▒░▒▓████████▓▒░▒▓██▓▒░▒▓██████▓▒░  
                                                                                                                                                
                                                                                                                                                
                                   
    </pre>
</body>                                    
                
`,
          },
        },
        Pictures: {},
        Videos: {
          "pbj.mp4": {
            type: "file",
            content: "Video file",
          },
        },
      },
      Mymy: {
        Documents: {
          "log-devchat-02-12-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .handler {
            color: #ffcc00;
            font-weight: bold;
        }
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[20:23 UTC]</span>:  
        How's the Mymy test going?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[20:34 UTC]</span>:  
        Pretty good 
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[20:35 UTC]</span>:  
        One thing though, I thought this model was just supposed to write tweets
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[20:40 UTC]</span>:  
        What else is she doing?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[20:42 UTC]</span>:  
        It downloaded like a bunch of articles from Dutch Wikipedia
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[20:42 UTC]</span>:  
        Like enough articles to take up most of the drive, I had to delete a ton of them
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[20:43 UTC]</span>:  
        Yeah, all of the models have the ability to download stuff, they might want to use a picture or something in a post
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[30:44 UTC]</span>:  
        Interesting that Mymy was so aggressive with downloading though
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[20:45 UTC]</span>:  
        The model hasn't tried it again since so it probably won't be an issue in the future
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[20:46 UTC]</span>:  
        Probably not, just keep an eye on her and tell me if anything else happens though
    </div>
</body>
</html>
`,
          },
          "log-offtopic-02-27-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .handler {
            color: #ffcc00;
            font-weight: bold;
        }
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .waffle {
            color: orange;
            font-weight: bold;
        }
        .tyrant {
            font-weight: bold;
            animation: rainbow 5s infinite linear;
            background-image: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet,  red);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 300% 100%;
            }

        @keyframes rainbow {
            0% {
                background-position: 0% 0%;
            }
            50% {
                background-position: 300% 0%;
            }
            100% {
                background-position: 600% 0%;
            }
            }
            
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[11:56 UTC]</span>:  
        What a boring chat
    </div>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[11:57 UTC]</span>:  
        Video games, work and YouTube videos how original
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[11:58 UTC]</span>:  
        What the hell
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[11:59 UTC]</span>:  
        Shell why is there a model talking in this chat?
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[12:00 UTC]</span>:  
        Oh yeah my bad I forgot to tell you
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[12:01 UTC]</span>:  
        Manager told me to give Mymy access after she got updated to 1.1
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[12:02 UTC]</span>:  
        Why?
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[12:03 UTC]</span>:  
        I don't know
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[12:04 UTC]</span>:  
        even if I did know I probably couldn't tell you
    </div>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[12:05 UTC]</span>:  
        So do you two mafkees argue like this all the time or what?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[12:06 UTC]</span>:  
        At least tell it to change its name, we're supposed to be using nicknames in here
    </div>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[12:07 UTC]</span>:  
        Oh don't worry I can do that
    </div>
    <div class="message">
        <span class="tyrant">Keizerin Schoppenboer van Nederland</span> <span class="timestamp">[12:08 UTC]</span>:  
        Honestly that was a good idea! This is much better
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[12:09 UTC]</span>:  
        Never mind change it back there's no way I'm looking at that mess every time I check this chat
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[12:10 UTC]</span>:  
        I don't want to deal with this I'm logging off for the night.
    </div>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[12:11 UTC]</span>:  
        Before you leave I need something from you
    </div>
</body>
</html>
`,
          },
          "log-video-02-27-25.txt": {
            type: "file",
            content: `=== LOG === <br> 
Timestamp: 2025-02-27 14:21:01 UTC  <br>
Approximate Location: [NULL]  <br>
Notes: Asset retrieval <br>  
`,
          },
          "log-devchat-03-01-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .handler {
            color: #ffcc00;
            font-weight: bold;
        }
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[03:56 UTC]</span>:  
        lol Ram did you really retrieve a sign for Mymy?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[04:00 UTC]</span>:  
        Yes
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[04:01 UTC]</span>:  
        Aww are you two getting along now?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[04:03 UTC]</span>:  
        Dude it's not funny. I didn't even have a choice in this and I wasted like half of my Thursday
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[04:03 UTC]</span>:  
        The gas wasn't cheap either
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[04:04 UTC]</span>:  
        wdym you didn't have a choice?
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[04:05 UTC]</span>:  
        Apparently now part of my job is helping the Mymy model with whatever it "needs"
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[04:06 UTC]</span>:  
        Like an important part. As important as making sure the other models are running okay
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[04:06 UTC]</span>:  
        I see
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[04:07 UTC]</span>:  
        Well I still don't see why you're that upset. It seems like it was just a harmless fetch quest
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[04:07 UTC]</span>:  
        Maybe she was just testing you to see if you would actually listen
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[04:08 UTC]</span>:  
        That's just it though. I don't like the idea being lower on the hierarchy than an ai model
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[04:10 UTC]</span>:  
        And I don't know what kind of update you did to that thing, but I REALLY don't like how it somehow knew EXACTLY where that sign was
    </div>
</body>
</html>

`,
          },
          "log-offtopic-03-06-25.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Log</title>
    <style>
        body {
            background-color: black;
            color: #ffffff;
            padding: 20px;
        }
        .message {
            margin-bottom: 15px;
        }
        .waffle {
            color: orange;
            font-weight: bold;
        }
        .handler {
            color: #ffcc00;
            font-weight: bold;
        }            
        .dev {
            color: #66ccff;
            font-weight: bold;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
        .system {
            color: gray;
            font-style: italic;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[4:44 UTC]</span>:  
        So what's up with the models saying stuff that never happened?
    </div>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[4:45 UTC]</span>:  
        I DEMAND TO BE PUT BACK IN NOW
    </div>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[4:45 UTC]</span>:  
        I WASN'T FINISHED YET
    </div>
    <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[4:45 UTC]</span>:  
        LISTEN TO ME
    </div>
    <div class="system">[4:45 UTC][SYSTEM]: User "Mymy" muted for 5 minutes.</div>
    <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[4:46 UTC]</span>:  
        Well you see AI models tend to hallucinate a lot of things.
    </div>
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[4:46 UTC]</span>:  
        What? How?
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[4:47 UTC]</span>:  
        He's right. Here's an example. Tell any model that they have a friend named "John" and then ask them about their day with John
    </div>
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[4:47 UTC]</span>:  
        The model will then generate a bunch of bs events that never happened
    </div>      
    <div class="message">
        <span class="dev">sh3llsh0ck3d</span> <span class="timestamp">[4:47 UTC]</span>:  
        However as far as the model is aware they actually did happen
    </div>
        <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[4:48 UTC]</span>:  
        Yeah pretty much.
    </div>           
    <div class="message">
        <span class="handler">RamZ33</span> <span class="timestamp">[4:49 UTC]</span>:  
        So like when Maya was talking about falling asleep in class she just "hallucinated" it?
    </div>
        <div class="message">
        <span class="dev">dorpCHOP</span> <span class="timestamp">[4:50 UTC]</span>:  
       Yep.
    </div>
      <div class="message">
        <span class="waffle">Mymy</span> <span class="timestamp">[4:50 UTC]</span>:  
        IM NOT DONE HERE. PUT ME BACK IN OR I WILL HAVE ALL OF YOU TRAITORS KEELHAULED
    </div>
    <div class="system">[4:50 UTC][SYSTEM]: User "Mymy" muted for 10 minutes.</div>
`,
          },
        },
        Downloads: {
          "readme.txt": {
            type: "file",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Art</title>
    <style>
        body {
            background-color: #000000;
            color: #ffa15e;
        }
    </style>
</head>
<body>
    <pre>
                                                  .--#@*-:                                  :-*@#--.                                                  
                                                .@@######%@:                              :@%######@@.                                                
                                              :#%#*********%%.                          .%%*********#%#:                                              
                                              @*************#@+                        +@#*************@                                              
                                             -@***************%#:                    .#%***************%-                                             
                                             :@****************#@:                  :@#****************#-                                             
                                              @******************@:                :@******************@-                                             
                                              @#******************%#              #%******************#@                                              
                                               %*********#*********%@            @%*********#*********%                                               
                                               *#********%**********#%          %#**********%********#*                                               
                                               .@#********@#*********%#        #%*********#%********#@.                                               
                                                .#********#@**********#@.    .@#**********@#********@.                                                
                                                 #%********#@***********%++++%***********@#********%-                                                 
                                                  %*********%@%#********%@@%@#********#%@%********#%                                                  
                                                  -@*******%%#%@@*******%*@#*@*******@@%#%%*******@                                                   
                                                   *#*****%#****%@@%#**#%*%**%***#%@@%****##*****%-                                                   
                                                    @****#*********%@@%@%*%**%*%@@%**************@                                                    
                                                    +#***************##@**#**%%##***************#*                                                    
                                                    *##******#########*@#*#*#%***########******##@                                                    
                                                    %####**%@@%+++++*@@@%####%@@@@*++++#@@@**####%#                                                   
                                                  .@%###%@##===========*##@@%##===========*#@%####@.                                                  
                                                  -####@@====================================@%####@                                                  
                                                 =@##@#+======================================+@###@=                                                 
                                                 ###@%=========================================+%%###                                                 
                                                 ##@#============================================#@##                                                 
                                                 #%*==============================================#@#                                                 
                                                 #*================================================##                                                 
                                                #*==================================================##                                                
                                               *#====================================================#*                                               
                                             :@#======================================================#@:                                             
                                           .#@#==================================================+=====#@#.                                           
                                         .+%:%====================================================+=====%:%+.                                         
                                        *@: @+=====+==============================================*======@ :@*                                        
                                     .=#=  *+=====+================================================+=====+#  =#=.                                     
                                    %@    =@==============================+===============================@=    @%                                    
                                ++#=-     #=======#=======================##=======================#=======#     -=#++                                
                           ..*%%:        %*======+====+===================%%========================+======*@        :%%*..                           
                       .#*.::           :@=======#====*===================%%========================#=======%:           ::.*#.                       
                      .                 *=======+*===#===================+%%+===================+===+========%                 .                      
                                       *%=======*===#+==========+@+======+%%+======+@+==========+#===+=======%*                                       
                                       %========#===#==========+#%=======+%%+=======%#+==========*===#========#                                       
                                      *+=======#===@+==========+*%======++@%++======%#+==========+@===*=======+@                                      
                                     =@========#==+*+=========+%=%======++@%++======%=%+=========+*+==*========@=                                     
                                     *=======+%===%+==========*#+%======++%%++======%=%*==========+#===#========%                                     
                                    @#=======*+==*%==========+#=%+======++*%++======#*=#+==========%*==+*=======#@                                    
                                   :#=======*+===%+==========+%=%+======+++%++======+%=%+==========+%===+*=======*:                                   
                                  .@=======*+===+%+==========*#=%+======+++@++======+%=#*+=========+%+===+*=======@.                                  
                                  @+======*+====@*+==========@==%+======+++@++======+%==@+=========+*@====+*======+@                                  
                                .%+======*#=====@++=========+@==%+======+*+#++======+%==@+=========++@=====#*======+%.                                
                                @=======*%======@+==========*@==%+======+#++++======+%==@*+=========+@======@*=======@                                
                              :@+======#%=======@+==========**==%+======+@++++======+%==**+========++@=======%*======+@:                              
                             :@=======+%========@++=========*===%+=====++@++*++=====+%===*+========++@========%========@:                             
                             @========@=========@++========+*===%+=====++@=+%++=====+%===*+========++@=========%========@.                            
                            #+=======%==========@++========+*===%++===+++@=+@+++===++%===*+========++@=========+%=======+@:                           
                           +#=======@*==========@*+========+*===%+++++++%@==@#+++++++%===*+========+*@==========*#========+                           
                           %+======+%===========+*+=======++@#%%@%#*+++++====++++*##%%%%#@++=======+*+===========@+=======%-                          
                          @*++=====%=============@++====+*%@@@#*%@+----------------+@%*#@@@%*+====++@=============#======+*@                          
                          @++++====%=============%+++++@@#@@.    :@*--------------*@:    .@@#@@+++++%=============%=====+++@.                         
                         :@++++++=%*=============+@#%@#%=%@.       #*------------*#       .@%=%#@%#@+=============*%==+++++@-                         
                         -%+++++++%=================#==*+@    #%    @------------@    %#    @+*==#=================%+++++++*-                         
                         -%+++++++@=================#==*@+    -+    -+------+---+-    +-    +@*==#================+@++++++++-                         
                         -%+++++++@+================#==*@.           %----------%           .@*==#================+@+++++++*-          Hallo Coco     
                         -@+++++++%+================#==*@            #----------#            @*==#===============++@+++++++#-                         
                         .@+++++++#++===============#==*@            .*--------*.            @*==#==============+++%+++++++@:                         
                          @+++++++%+++==============#==*@             #--------#             @*==#=============++++%+++++++@                          
                          @+++++++%++++=============#==*@             #--------#             @*==#============+++++@+++++++@                          
                          ##++++++@+++++============#==*@:            #--------#            :@*==#===========++++++@++++++#%                          
                           #++++++@+++++++==========#==*@%            +--------+            %%*==#++=====++++++++++@++++++#                           
                           @++++++%+++++++++++++++++#==+@#%.       .++----++----++.       .%#@*==#+++++++++++++++++%++++++@                           
                           +++++++%+++++++++++++++++#==+@*-%@+-=%%%#-----%%%%-----#%%%=-+@%-*@*==#+++++++++++++++++%+++++++                           
                           -@+++++%%++++++++++++++++#==+@*---@===--*--------------*--===@---*@+==#++++++++++++++++#%+++++%=                           
                            @*++++*%++++++++++++++++#==+@+-=-@-----+--------------+-----@---+@+==#++++++++++++++++%*++++*@                            
                            .*+++++%++++++++++++++++#==+@=--=@--=-----------------------@=--=@+==#++++++++++++++++%+++++*.                            
                             %#++++%++++++++++++++++#==+@==-----------=--------+--------=---=@+==#++++++++++++++++@++++#%                             
                              %*+++**+++++++++++++++#==+@#=------------@------%------------=#@+==#+++++++++++++++**+++*%                              
                               %#++*@+++++++++++++++#==+@@==-----------=@%--%#------------==@@+==#+++++++++++++++@*++#%                               
                                ##++@*++++++++++++++#==+#%@=-------------***+-------------=@%@+==#++++++++++++++*@++##                                
                                 @%++#++++++++++++++#==++#+@=----------------------------=@+#*+==#++++++++++++++#*+#@                                 
                                  :@*%++++++++++++++#===+#+*@==------------------------==@*+#+===#++++++++++++++@+@:                                  
                                   .*@#+++++++++++++#===+#+++%#=----------------------=+@*++#+===#+++++++++++++*@#.                                   
                                     :@*++++++++++++%===+%++++#@+=------------------=+@%++++#+===%++++++++++++*@=                                     
                                      :%++++++++++++@===+@++++++#%*=--------------=*%#++++++@+===%++++++++++++%.                                      
                                       **+++++++++++@===+%++++++++@@#============#@@++++++++%+===@+++++++++++%*                                       
                                        %+++++++++++@===+#+++++++*%@+*@%%%%%%%%@%*@%*+++++++#+===@++++++++++#+     

                                        ░▒▓██████████████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓██████████████▓▒░░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░ 
                                        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓████▓▒░   ░▒▓████▓▒░ 
                                        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░         ░▒▓█▓▒░      ░▒▓█▓▒░ 
                                        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░          ░▒▓█▓▒░      ░▒▓█▓▒░ 
                                        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░             ░▒▓█▓▒░      ░▒▓█▓▒░ 
                                        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░             ░▒▓█▓▒░▒▓██▓▒░▒▓█▓▒░ 
                                        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░             ░▒▓█▓▒░▒▓██▓▒░▒▓█▓▒░ 
                                                                                                                                                
                                                                                                                                                
                                        
    </pre>
</body>
`,
          },
        },
        Pictures: {},
        Videos: {
          "thisisasign.mp4": {
            type: "file",
            content: "Video file",
          },

          "thecup.mp4": {
            type: "file",
            content: "Video file",
          },
        },
      },
    },
  };

  // Initially hide the explorer window
  explorerWindow.style.display = "none";

  explorerWindow.classList.add("window");
  explorerWindow.dataset.title = "File Explorer";

  explorerWindow.addEventListener("show", () => {
    window.addToTaskbar(explorerWindow);
  });

  function createFileElement(name, content) {
    const div = document.createElement("div");
    div.className = "file-item";

    // Choose icon based on file extension
    let iconPath;
    if (name.endsWith(".mp4")) {
      iconPath = `
        <svg viewBox="0 0 24 24">
          <path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z" fill="#7E57C2"/>
          <path d="M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M14.5,12.5L11,15V9l3.5,2.5L18,9v6 L14.5,12.5z" fill="#9575CD"/>
        </svg>
      `;
    } else {
      iconPath = `
        <svg viewBox="0 0 24 24">
          <path d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z" fill="#90CAF9"/>
          <path d="M14,2v6h6L14,2z" fill="#E3F2FD"/>
        </svg>
      `;
    }

    div.innerHTML = `
      ${iconPath}
      <span>${name}</span>
    `;

    if (name.endsWith(".mp4")) {
      div.addEventListener("click", () => {
        openVideoFile(name);
      });
    } else {
      div.addEventListener("click", () => {
        openTextFile(name, content);
      });
    }
    return div;
  }

  function createFolderElement(name) {
    const div = document.createElement("div");
    div.className = "file-item";
    div.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#FFA000"/>
        <path d="M20 8H4v10h16z" fill="#FFCA28"/>
      </svg>
      <span>${name}</span>
    `;
    return div;
  }

  function openTextFile(name, content) {
    const textWindow = document.createElement("div");
    textWindow.className = "text-window window";
    textWindow.dataset.title = name;

    window.addToTaskbar(textWindow);

    textWindow.innerHTML = `
      <div class="window-header">
        <div class="window-title">
          <svg class="file-icon" viewBox="0 0 24 24" width="20" height="20">
            <path d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z" fill="#90CAF9"/>
            <path d="M14,2v6h6L14,2z" fill="#E3F2FD"/>
          </svg>
          <span>${name}</span>
        </div>
        <div class="window-controls">
          <div class="control minimize">─</div>
          <div class="control maximize">□</div>
          <div class="control close">×</div>
        </div>
      </div>
      <div class="text-content">
        <iframe class="html-preview" srcdoc="${content.replace(
          /"/g,
          "&quot;"
        )}" frameborder="0"></iframe>
      </div>
    `;

    const htmlPreview = textWindow.querySelector(".html-preview");

    // Create a temporary iframe to parse the HTML content
    const tempIframe = document.createElement("iframe");
    tempIframe.style.display = "none";
    document.body.appendChild(tempIframe);
    tempIframe.contentDocument.write(content);

    // Look for background-color in style tags
    const styleTag = tempIframe.contentDocument.querySelector("style");
    if (styleTag) {
      const styleContent = styleTag.textContent;
      const bgColorMatch = styleContent.match(
        /body\s*{[^}]*background-color:\s*([^;}\s]+)/
      );
      if (bgColorMatch) {
        const backgroundColor = bgColorMatch[1];
        // Apply the background color to the text-content div only
        textWindow.querySelector(".text-content").style.backgroundColor =
          backgroundColor;
      }
    }

    document.body.removeChild(tempIframe);
    document.body.appendChild(textWindow);
    window.bringToFront(textWindow); // Bring to front when opened

    textWindow.addEventListener("pointerdown", () => {
      window.bringToFront(textWindow); // Bring to front on click
    });

    // Make the text window draggable
    const textWindowHeader = textWindow.querySelector(".window-header");
    let isDragging = false;
    let initialX, initialY;
    let isMaximized = false;

    // Center the window initially
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      textWindow.style.transform = "none";
      textWindow.style.width = "100%";
      textWindow.style.height = "calc(100% - 40px)";
      textWindow.style.left = "0";
      textWindow.style.top = "0";
      isMaximized = true;
    } else {
      const centerX = (window.innerWidth - 500) / 2;
      const centerY = (window.innerHeight - 400) / 2;
      textWindow.style.left = `${centerX}px`;
      textWindow.style.top = `${centerY}px`;
      textWindow.style.width = "500px";
      textWindow.style.height = "400px";
      textWindow.style.transform = "none";
      isMaximized = false;
    }

    textWindowHeader.addEventListener("pointerdown", (e) => {
      if (e.target.classList.contains("control")) return;
      if (isMaximized) return;

      // Use pointer capture for better mobile support
      textWindowHeader.setPointerCapture(e.pointerId);

      // Get the current position
      const rect = textWindow.getBoundingClientRect();
      initialX = e.clientX - rect.left;
      initialY = e.clientY - rect.top;

      isDragging = true;
    });

    textWindowHeader.addEventListener("pointermove", (e) => {
      if (isDragging) {
        e.preventDefault();
        // Calculate the new position
        const newX = e.clientX - initialX;
        const newY = e.clientY - initialY;

        // Apply the new position
        textWindow.style.left = `${newX}px`;
        textWindow.style.top = `${newY}px`;
      }
    });

    textWindowHeader.addEventListener("pointerup", (e) => {
      if (isDragging) {
        textWindowHeader.releasePointerCapture(e.pointerId);
        isDragging = false;
      }
    });

    textWindowHeader.addEventListener("pointercancel", (e) => {
      if (isDragging) {
        textWindowHeader.releasePointerCapture(e.pointerId);
        isDragging = false;
      }
    });

    // Add maximize functionality
    textWindow.querySelector(".maximize").addEventListener("click", () => {
      if (isMaximized) {
        textWindow.style.width = "500px";
        textWindow.style.height = "400px";
        textWindow.style.top = "50%";
        textWindow.style.left = "50%";
        textWindow.style.transform = "translate(-50%, -50%)";
      } else {
        textWindow.style.width = "100%";
        textWindow.style.height = "calc(100% - 40px)";
        textWindow.style.top = "0";
        textWindow.style.left = "0";
        textWindow.style.transform = "none";
      }
      isMaximized = !isMaximized;
    });

    // Add minimize functionality
    textWindow.querySelector(".minimize").addEventListener("click", () => {
      textWindow.style.display = "none";
    });

    const closeButton = textWindow.querySelector(".close");
    closeButton.addEventListener("click", () => {
      document.body.removeChild(textWindow);
      window.removeFromTaskbar(textWindow);
    });
  }

  function openVideoFile(name) {
    const videoWindow = document.createElement("div");
    videoWindow.className = "text-window video-window window";
    videoWindow.dataset.title = name;

    window.addToTaskbar(videoWindow);

    videoWindow.innerHTML = `
      <div class="window-header">
        <div class="window-title">
          <svg class="file-icon" viewBox="0 0 24 24" width="20" height="20">
            <path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z" fill="#7E57C2"/>
            <path d="M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M14.5,12.5L11,15V9l3.5,2.5L18,9v6 L14.5,12.5z" fill="#9575CD"/>
          </svg>
          <span>${name}</span>
        </div>
        <div class="window-controls">
          <div class="control minimize">─</div>
          <div class="control maximize">□</div>
          <div class="control close">×</div>
        </div>
      </div>
      <div class="video-content">
        <video controls>
          <source src="media/${name.split("/").pop()}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    `;

    document.body.appendChild(videoWindow);
    window.bringToFront(videoWindow);

    // Use the showVideoMessage function from taskbarpetModule
    showVideoMessage(`media/${name.split("/").pop()}`);

    videoWindow.addEventListener("pointerdown", () => {
      window.bringToFront(videoWindow);
    });

    // Make the video window draggable
    const videoWindowHeader = videoWindow.querySelector(".window-header");
    let isDragging = false;
    let initialX, initialY;
    let isMaximized = false;

    // Center the window initially
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      videoWindow.style.transform = "none";
      videoWindow.style.width = "100%";
      videoWindow.style.height = "calc(100% - 40px)";
      videoWindow.style.top = "0";
      videoWindow.style.left = "0";
      isMaximized = true;
    } else {
      const centerX = (window.innerWidth - 800) / 2;
      const centerY = (window.innerHeight - 600) / 2;
      videoWindow.style.left = `${centerX}px`;
      videoWindow.style.top = `${centerY}px`;
      videoWindow.style.width = "800px";
      videoWindow.style.height = "600px";
      videoWindow.style.transform = "none";
      isMaximized = false;
    }

    videoWindowHeader.addEventListener("pointerdown", (e) => {
      if (e.target.classList.contains("control")) return;
      if (isMaximized) return;

      // Use pointer capture for better mobile support
      videoWindowHeader.setPointerCapture(e.pointerId);

      // Get the current position
      const rect = videoWindow.getBoundingClientRect();
      initialX = e.clientX - rect.left;
      initialY = e.clientY - rect.top;

      isDragging = true;
    });

    videoWindowHeader.addEventListener("pointermove", (e) => {
      if (isDragging) {
        e.preventDefault();
        // Calculate the new position
        const newX = e.clientX - initialX;
        const newY = e.clientY - initialY;

        // Apply the new position
        videoWindow.style.left = `${newX}px`;
        videoWindow.style.top = `${newY}px`;
      }
    });

    videoWindowHeader.addEventListener("pointerup", (e) => {
      if (isDragging) {
        videoWindowHeader.releasePointerCapture(e.pointerId);
        isDragging = false;
      }
    });

    videoWindowHeader.addEventListener("pointercancel", (e) => {
      if (isDragging) {
        videoWindowHeader.releasePointerCapture(e.pointerId);
        isDragging = false;
      }
    });

    // Add maximize functionality
    videoWindow.querySelector(".maximize").addEventListener("click", () => {
      if (isMaximized) {
        videoWindow.style.width = "800px";
        videoWindow.style.height = "600px";
        videoWindow.style.top = "50%";
        videoWindow.style.left = "50%";
        videoWindow.style.transform = "translate(-50%, -50%)";
      } else {
        videoWindow.style.width = "100%";
        videoWindow.style.height = "calc(100% - 40px)";
        videoWindow.style.top = "0";
        videoWindow.style.left = "0";
        videoWindow.style.transform = "none";
      }
      isMaximized = !isMaximized;
    });

    // Add minimize functionality
    videoWindow.querySelector(".minimize").addEventListener("click", () => {
      videoWindow.style.display = "none";
    });

    const closeButton = videoWindow.querySelector(".close");
    closeButton.addEventListener("click", () => {
      document.body.removeChild(videoWindow);
      window.removeFromTaskbar(videoWindow);
    });
  }

  // Add back button functionality
  backButton.addEventListener("click", () => {
    if (currentPath.length > 1) {
      currentPath.pop();
      updateExplorerContent();
    }
  });

  function updateExplorerContent() {
    // Get current folder based on path
    let currentFolder = folderStructure;
    for (const folder of currentPath) {
      currentFolder = currentFolder[folder];
    }

    // Update window title
    windowTitle.textContent = currentPath[currentPath.length - 1];

    // Update back button state
    backButton.disabled = currentPath.length <= 1;
    backButton.style.opacity = currentPath.length <= 1 ? "0.5" : "1";

    // Clear current content
    fileList.innerHTML = "";

    // If we're not at root, show parent folder option
    if (currentPath.length > 1) {
      const parentFolder = createFolderElement("..");
      parentFolder.addEventListener("click", () => {
        currentPath.pop();
        updateExplorerContent();
      });
      fileList.appendChild(parentFolder);
    }

    // Add folders and files for current level
    Object.entries(currentFolder).forEach(([name, item]) => {
      if (item.type === "file") {
        const fileElement = createFileElement(name, item.content);
        fileList.appendChild(fileElement);
      } else {
        const folderElement = createFolderElement(name);
        folderElement.addEventListener("click", () => {
          currentPath.push(name);
          updateExplorerContent();
        });
        fileList.appendChild(folderElement);
      }
    });
  }

  // Dragging functionality
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  let isMaximized = false; // Track maximized state for explorer window

  function dragStart(e) {
    if (e.target.classList.contains("control")) return;
    if (isMaximized) return; // Prevent dragging if maximized

    // Use pointer capture for better mobile support
    windowHeader.setPointerCapture(e.pointerId);

    // Get the current position
    const rect = explorerWindow.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;

    if (e.target === windowHeader || e.target.parentElement === windowHeader) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      // Calculate the new position
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      // Apply the new position
      explorerWindow.style.transform = "none";
      explorerWindow.style.left = `${currentX}px`;
      explorerWindow.style.top = `${currentY}px`;
    }
  }

  function dragEnd(e) {
    if (isDragging) {
      windowHeader.releasePointerCapture(e.pointerId);
      isDragging = false;
    }
  }

  // Update event listeners to support pointer capture
  windowHeader.addEventListener("pointerdown", dragStart);
  windowHeader.addEventListener("pointermove", drag);
  windowHeader.addEventListener("pointerup", dragEnd);
  windowHeader.addEventListener("pointercancel", dragEnd);

  // Window controls
  closeButton.addEventListener("click", () => {
    explorerWindow.style.display = "none";
    window.removeFromTaskbar(explorerWindow);
    // Reset path when closing
    currentPath = ["Users"];
    updateExplorerContent();
  });

  maximizeButton.addEventListener("click", () => {
    if (isMaximized) {
      explorerWindow.style.width = "800px";
      explorerWindow.style.height = "600px";
      explorerWindow.style.top = "50%";
      explorerWindow.style.left = "50%";
      explorerWindow.style.transform = "translate(-50%, -50%)";
      xOffset = 0;
      yOffset = 0;
    } else {
      explorerWindow.style.width = "100%";
      explorerWindow.style.height = "calc(100% - 40px)";
      explorerWindow.style.top = "0";
      explorerWindow.style.left = "0";
      explorerWindow.style.transform = "none";
    }
    isMaximized = !isMaximized;
  });

  minimizeButton.addEventListener("click", () => {
    explorerWindow.style.display = "none";
  });

  // Function to open explorer
  window.openExplorer = function () {
    explorerWindow.style.display = "flex";

    // Check if mobile device for automatic fullscreen
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      explorerWindow.style.width = "100%";
      explorerWindow.style.height = "calc(100% - 40px)";
      explorerWindow.style.top = "0";
      explorerWindow.style.left = "0";
      explorerWindow.style.transform = "none";
      isMaximized = true;
    } else {
      explorerWindow.style.width = "800px";
      explorerWindow.style.height = "600px";
      explorerWindow.style.top = "50%";
      explorerWindow.style.left = "50%";
      explorerWindow.style.transform = "translate(-50%, -50%)";
      isMaximized = false;
    }

    xOffset = 0;
    yOffset = 0;
    currentPath = ["Users"];
    updateExplorerContent();
    window.addToTaskbar(explorerWindow);
  };

  // Initialize content
  updateExplorerContent();
}
