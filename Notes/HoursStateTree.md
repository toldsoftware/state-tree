# 2017-01-08

## 21:00-21:09

- Setup Project

## 21:10-21:17

- Copy Code from told-front

## 21:18-22:09

- Add StateChange
	- NewStateDelta
	- OldStateDelta
	- Metadata

## 22:10-1:30

- Convert StateData to StateTree
- FAIL: Cannot return a value with get and an object with subscribe
	- OPTION 1: Use .prop.value for value get and set
	- OPTION 1B: Use .prop.value only for value get (set still works without .value)
	- OPTION 2: Use .prop_node for .subscribe, .unsubscribe, etc.
	- OPTION 3: Use .prop_subscribe, .prop_unsubscribe, etc.

## 1:30-1:47

- Use .value for reading value

## 1:47-2:07

- FIX .value of parent nodes will not return new values of child nodes (but instead snapshot of when the parent was changed)
	- Should rebuild the parent with children upon getValue()


# 2017-01-09

## 13:00-14:39 

- Change to always use .value for get and set:
	- get accessor is getting called everytime for parents, causing the sub tree to be reconstructed just to use do notation down the tree
	- .get and .set are inconsistent 
	- array methods will be easier to implement

## 14:40-15:44

- Add Arrays

## 15:45-17:52

- Test changes of branch with nested values
- Test changes to tree structure

## 19:23-19:51

- Record addItem
- Test Array Push

## 20:30-21:09

- Add Array Insert

##

- Convert Changes of StateTree to StateChanges 


## 

- Handle Multiple Editors Race Condition
	- Multiple Devices edit a single state value
	- Both devices send a state change
	- 1st state change completes
	- 2nd state change is invalid because it finds unexpected old state
	- Option 1: Verify Change Strategy 
		- Notify User that state change failed
		- comfirm if change is still valid
		- replay following state changes
	- Option 2: Last One Wins Strategy
		- Ignore if old state doesn't match
		- 1st state change is essentially replaced (undo potentially skips over it)