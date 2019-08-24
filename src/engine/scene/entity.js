/**
 * Represents a single entity in the world. Entities themselves do not get rendered or have behaviors.
 * The do, however, have transforms and may have child entities. Components may be attached to entities to decorate functionality.
 */

"use strict"

class Entity {

    constructor(obj = {}, scene) {
        this.enabled = obj.enabled || true;
        // identifier
        this.name = obj.name;
        this.tags = obj.tags;
        // transform
        this.position = new engine.Vec2(obj.position);
        this.positionZ = 0;
        this.rotation = new engine.Vec2(obj.rotation);
        this.scale = new engine.Vec2(obj.scale);

        this._localMatrix = new engine.Mat4();
        this._worldMatrix = new engine.Mat4();

        // components
        this.components =
            Array.isArray(obj.components) ?
                obj.components.map(component =>
                    new (
                        engine.components(component.name)           // get the constructor of the corresponding component type
                    )(component)
                ) :
                []

        this._scene = scene
        this._parent = null

        this._children =
            (typeof obj.children == 'object') ?
                this._children = obj.children.map(child =>
                    new Entity(child, scene)
                ) :
                null

    }

    get worldPosition() {
        return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14])
    }

    addChild = child => {
        if (child instanceof Entity) {
            child._parent = this
            child._scene = this._scene
            this._children.push(child)
        } else {
            console.error(`Type Error: `)
        }
    }

    removeChild = child => {
        index = this._children.indexOf(child)

        if (index !== -1) {
            this._children[index]._parent = null
            this._children[index]._scene = null
            this._children.splice(index, 1)
        }
    }

    getComponent = name => {
        var component = this._components.find(c => c.name == name)
        if (component != undefined) {
            return component
        }

        for (var child of this._children) {
            var component = child.getComponent(name)
            if (component !== undefined) {
                return component
            }
        }
        return undefined
    }

    getEntity = name => {
        if (this.name == name) {
            return this
        }

        for (var child of this._children) {
            var result = child.getEntity(name)
            if (result !== undefined) {
                return result
            }
        }
        return undefined
    }

    _translationMatrix = new engine.Mat4()
    _rotationMatrix = new engine.Mat4()
    _scaleMatrix = new engine.Mat4()
    _axis = {
        x: 0,
        y: 0,
        z: 1,
    }

    update = time => {
        if (!this.enabled) return

        this._localMatrix.setTRC(
            _translationMatrix.setTranslate(this.position.x, this.position.y, 0),
            _rotationMatrix.setFromAxisAngle(_axis, this.rotation),
            _scaleMatrix.setScale(this.scale.x, this.scale.y, 1),
        )
        this._worldMatrix.copy(this._localMatrix)
        if (_this._parent != null) {
            this._worldMatrix.mul(_this._parent._worldMatrix)
        }

        this._components.forEach(c => {
            c.update()
        })
        this._children.forEach(c => {
            c.update(time)
        })
    }

    draw = camera => {
        if (!this.enabled) return

        this._components.forEach(c => {
            c.draw(camera)
        })
        this._children.forEach(c => {
            c.draw(camera)
        })
    }

    stop = () => {
        if (!this.enabled) return

        this._components.forEach(c => {
            c.stop()
        })
        this._children.forEach(c => {
            c.stop()
        })
    }

}