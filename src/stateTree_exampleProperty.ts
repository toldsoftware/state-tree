export class Base2Test {
    constructor() {
    }
}

export class BaseTest extends Base2Test {
    constructor() {
        super();
    }
}

export class Test extends BaseTest {
    get a() { return true; }
    set a(v: boolean) { v; }

    constructor() {
        super();
    }
}