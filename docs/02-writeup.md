# Build writeup e rubric

Fonte: build-a-learning-world.markkashef.chatgpt.site/

Build a Learning World — The Community Field Guide
- 

Skip to the guide (#guide)
EATHE WORLDBUILDINGFIELD GUIDE (/)The guide (/)Full build prompt ↗ (/prompt/)

01 / THE SMALLEST USEFUL WORLDEARLY AI ADOPTERS · COMMUNITY WORKSHOP

# Build alearning world.
Three places. Three visible actions. Three ideas people remember.
A 3D lesson works when the learner can see an idea happen. Start with a tiny world that teaches one thing at each stop.
Open the Claude workshop ↗ (https://pure-coral-qwnd.here.now/)

OUR WORKING EXAMPLE
01

### The control gate
A request meets a check.The action waits.

ENFORCE
02

### Context drawers
Shared instructions gowhere the team can use them.

PLACE
03

### Evidence check
An answer meets its source.Unsupported facts stay unknown.

VERIFY
One guide connects the whole experience.

Start here: choose three ideas that can become visible actions.
The six essential parts ↓ (#components)

02 / WHAT YOU ARE ACTUALLY BUILDINGTHE COMPONENTS

## Six parts.One experience.
The model is only one part of the world. The camera and interface decide whether anyone understands it.

01

### Assets
The mascot and props. Model in Blender; export a GLB the browser can load.
02

### Stage & light
Place the objects, set their scale, and light them so surfaces and shadows read.
03

### Camera
Give every station a wide view, a close-up, and a calm transition between them.
04

### Interaction
A small state machine controls what moves, what changes, and when it finishes.
05

### Guide & interface
Explain the objects, describe the action, then leave the learner with one takeaway.
06

### Testing & delivery
Inspect the actual browser experience, then publish the exact tested version.

Keep the jobs separate: Blender makes assets. The browser makes them interactive.
Design the lesson ↓ (#stations)

03 / TURN AN IDEA INTO A PLACEDESIGN BEFORE GEOMETRY

## One station.One visible change.
Write this sentence first: “The learner sees this happen, so they understand that.”

THE PRINCIPLETHE PHYSICAL METAPHORTHE VISIBLE PROOF
01

### Enforce before acting

A gate between a request and a tool.
The first request stops. A passing request gets through.

02

### Give guidance a home

Drawers for personal, project, and scoped instructions.
A shared card enters the project drawer. Both teammates receive it.

03

### Check the evidence

Two inspection frames: structure and source.
A total changes from 100 to 90. An unsupported date becomes unknown.

Your design test: if nothing changes, it is a display. Give the learner an action to follow.
Build the assets ↓ (#assets)

04 / THE MASCOT IS YOUR VISUAL ANCHORFROM REFERENCE TO RUNTIME
Claude asset study · Blender source renderThe live scene has its own lighting and camera.

## Recognition first.Detail second.
Give the agent an identity reference and a depth reference.
- Lock the silhouette. Preserve the body, face, feet, and distinctive proportions.
- Make light catch the edges. Apply bevels and good normals; keep broad surfaces calm.
- Separate anything that moves. Name the root, legs, and tabs so animation can find them.
- Inspect the exported model. Check the whole hierarchy, orientation, scale, and floor contact in the browser.

Delivery: keep the editable .blend, generator, and browser-ready .glb together.
Direct the camera ↓ (#camera)

05 / THE CAMERA IS PART OF THE LESSONPACE THE EXPERIENCE

## Arrive. Move closer.Show. Let it land.
A close-up directs attention. A hold gives people time to understand what changed.

01

### Arrive
Show the whole station and identify its parts.
2–3 seconds
02

### Move closer
Ease toward the mechanism before it starts.
2–3 seconds
03

### Demonstrate
Run one action. Keep the important objects visible.
5–6 seconds
04

### Hold
Keep the final state still while the takeaway appears.
5 seconds

Control gateA low, gentle side move.
Context drawersA rising view into the trays.
Evidence checkA lateral view of record and source.

Two ways to visit: a paced World Tour and free orbit, zoom, and pan. Include Pause and Reset.
Make the action clear ↓ (#guidance)

06 / DO NOT MAKE PEOPLE GUESSTHE EXPLANATION LAYER

## The world needsa voice.
A beautiful mechanism can still be confusing. One card should answer three questions.
- 01What am I looking at?Name the objects in ordinary language.

- 02What is happening now?Match the sentence to the action on screen.

- 03What should I remember?Hold one useful principle before moving on.

01 / THE CONTROL GATE

### A check that canstop an action.
WHAT YOU’RE LOOKING ATThe yellow block is a request. The gate is a required check. The wheel represents the action.

WATCH WHAT HAPPENSThe first request stops. A passing request opens the gate.

THE TAKEAWAYUse code or a blocking hook to enforce mandatory checks.

Pause to look closerExample station card · stays beside the action

Reserve space: card beside the scene on desktop; below it on mobile. End with a three-point recap.
Choose the build order ↓ (#workflow)

07 / GIVE EACH TOOL A JOBTHE BUILD ORDER

## Prove one station.Then build three.
A working first station reveals scale, framing, and interaction problems before you repeat them.

- 1Brief + station mapDefine audience, three principles, actions, and acceptance checks.

- 2Scene + first stationUse simple geometry. Make the camera, demo, and explanation work together.

- 3Mascot + remaining stationsImport the refined GLB. Reuse the interaction pattern; vary the demonstrations.

- 4Tour + QA + publishJoin the camera views, add free exploration, inspect, then deploy.

BLENDERAuthor the mascot and export claude.glb.

BABYLON.JSLoad the model, light the stage, move the camera, and animate the props.

HTML + CSS + JAVASCRIPTBuild the cards, station navigation, tour controls, and summary.

VITE + HOSTINGDevelop locally, build the site, and publish the tested output.

No live AI required: these three demonstrations can be deterministic animations in the browser.
Write the prompt ↓ (#prompt-method)

08 / PROMPT THE EXPERIENCE, NOT THE VIBETHE PROMPT FORMULA

## Describe decisionsthe agent can execute.
“Make it premium” is a taste request. Add the concrete behavior and checks that define premium for your project.

TOO MUCH LEFT TO GUESS“Build an amazing 3D Claude world with three stations and beautiful animations.”The agent still has to invent the lesson, camera, controls, and finish line.
A DIRECTION THE AGENT CAN BUILD“Create three stations. At each one, approach over 3 seconds, show a readable close-up, run one 6-second demonstration, then hold the result and its takeaway for 5 seconds.”Then specify the mascot, palette, free-camera controls, card placement, and browser checks.

Outcome+Audience+References+Stations+Behavior+Constraints+Checks
Attach the evidence: identity image, depth reference, and one experience you want the pacing to resemble.
Set the finish line ↓ (#quality)

09 / QUALITY IS SOMETHING YOU CHECKTHE RELEASE STANDARD

## Judge the browser.Check the whole journey.
A successful export or a beautiful Blender render does not prove the visitor’s experience.

READABLE

### Can people see it?
- Mascot silhouette and face remain recognizable.
- Feet touch the floor; parts are not missing.
- Labels are crisp at every close-up.
- Cards never cover the demonstration.
UNDERSTANDABLE

### Can people follow it?
- The caption matches the current action.
- Every station has one visible before-and-after.
- The camera holds the result long enough.
- The final summary explains all three ideas.
USABLE

### Can people control it?
- Orbit, zoom, pan, and reset work.
- Pause freezes both the camera and demo.
- Replay starts cleanly; reduced motion works.
- Desktop, mobile, and the deployed URL are checked.

One trap from the workshop: rebuilding the source does not update an old production preview. Confirm which build and asset the browser actually loaded before diagnosing a visual defect.
Performance: record the device, viewport, and measured frame timing. Treat a local result as a local result.
Take the complete prompt ↓ (#take-it)

10 / FROM THIS WORKSHOP TO YOURSTHE REUSABLE RECIPE

## Change the subject.Keep the recipe.
The complete prompt lives on its own page, ready to copy into your coding agent.
It includes the three Claude stations, asset requirements, camera pacing, controls, file structure, build order, and acceptance checklist.
Open the full build prompt ↗ (/prompt/)
01

### Pick your audience
Who is learning, and what should they understand when they leave?

02

### Choose three principles
Give each one a physical metaphor and one visible action.

03

### Choose your visual identity
Supply the mascot reference and set a focused palette. Keep the navigation recipe.

Claude workshop ↗ (https://pure-coral-qwnd.here.now/)Original Codex world ↗ (https://wintry-soul-6awh.here.now/)Babylon GLB loading ↗ (https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF)CSS scroll snap ↗ (https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap)
A field guide by Mark Kashef for Early AI Adopters. Community-created learning material.
Back to the beginning ↑ (#start)

01 / Start small
↑1 / 10↓
