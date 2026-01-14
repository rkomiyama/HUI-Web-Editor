import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import styles from "@/styles/components/visual/ComponentQuickEdit.module.scss";
import type {HoloUIComponent, HoloUIButtonData, HoloUIIcon, HoloUIData, HoloUIAction, ModalData, HoloUITextIcon, HoloUIItemIcon, HoloUITextImageIcon, HoloUICommandAction, HoloUISoundAction} from "@/util/types";
import IconEditor from "@/components/modal/edit/IconEditor";
import ActionList from "@/components/modal/action/ActionList";
import {BiSave} from "react-icons/bi";
import {type ChangeEvent, useEffect, useState} from "react";
import {useModal} from "@/hooks/ModalHook";
import StaticComponentModal from "@/components/modal/edit/type/static/StaticComponentModal";
import ButtonComponentModal from "@/components/modal/edit/type/button/ButtonComponentModal";
import {BsQuestionLg} from "react-icons/bs";
import ToggleComponentModal from "@/components/modal/edit/type/toggle/ToggleComponentModal";
import {useComponent} from "@/hooks/ComponentHook";

function getEditStaticModal(component: HoloUIComponent): ModalData {
    return {
        title: "Edit Static Component",
        content: <StaticComponentModal
            isCreate={false}
            defaultValue={component}
        />,
    };
}

function getEditButtonModal(component: HoloUIComponent): ModalData {
    return {
        title: "Edit Button Component",
        content: <ButtonComponentModal
            isCreate={false}
            defaultValue={component}
        />,
    };
}

function getEditToggleModal(component: HoloUIComponent): ModalData {
    return {
        title: (
            <div className={styles.modalHeaderTitle}>
                <h3>
                    Edit Toggle Component
                </h3>
                <a
                    href={"https://docs.volmit.com/hologui"}
                    target={"_blank"}
                    referrerPolicy={"no-referrer"}
                    data-label={"Toggle Documentation"}
                >
                    <BsQuestionLg/>
                </a>
            </div>
        ),
        content: <ToggleComponentModal
            isCreate={false}
            defaultValue={component}
        />,
    };
}

export default function ComponentQuickEdit() {
    const {selectedComponent, setSelectedComponent, data, setData} = useComponent();
    const [component, setComponent] = useState<HoloUIComponent | undefined>(undefined);
    const {setModal} = useModal();
    useEffect(() => {
        if (!data || !selectedComponent) {
            return;
        }

        const component = data.components.find(component => component.id === selectedComponent);
        if (!component) {
            return;
        }

        setComponent(component);
    }, [selectedComponent, data]);

    if (!selectedComponent || !data || !component) {
        return (<></>);
    }

    /**
     * Handle the ID being changed
     *
     * @param e The change event
     */
    function handleIDChange(e: ChangeEvent<HTMLInputElement>) {
        if (!data || !component) {
            return;
        }

        const newID = e.target.value;
        if (newID === component.id || newID === "") {
            e.preventDefault();
            return;
        }

        if (data.components.find(component => component.id === newID)) {
            alert("Component ID already exists!");
            return;
        }

        setData(currentData => {
            if (!currentData) {
                return currentData;
            }

            return {
                ...currentData,
                components: currentData.components.map(component => {
                    if (component.id !== selectedComponent) {
                        return component;
                    }

                    return {
                        ...component,
                        id: newID
                    };
                })
            } as HoloUIData;
        });

        // Set new selected component to the new ID
        setSelectedComponent(newID);
    }

    /**
     * Handle the offset being changed
     *
     * @param e  The change event
     * @param index The index of the offset to change
     */
    function handleOffsetChange(e: ChangeEvent<HTMLInputElement>, index: number) {
        if (!data || !component) {
            return;
        }

        const newOffsetNumber = Number(e.target.value);
        if (newOffsetNumber === component.offset[index]) {
            return;
        }

        const newOffset = [...component.offset];

        // Set the new offset
        newOffset[index] = newOffsetNumber;

        // Update the data
        setData(currentData => {
            if (!currentData) {
                return currentData;
            }

            return {
                ...currentData,
                components: currentData.components.map(component => {
                    if (component.id !== selectedComponent) {
                        return component;
                    }

                    return {
                        ...component,
                        offset: newOffset
                    };
                })
            } as HoloUIData;
        });
    }

    function handleEditComponent() {
        if (!component || !component.data) {
            return;
        }

        const data = component.data;
        if (data.type === 'toggle') {
            setModal(getEditToggleModal(component));
            return;
        }

        if (data.type === 'button') {
            setModal(getEditButtonModal(component));
            return;
        }

        setModal(getEditStaticModal(component));
    }

    /**
     * Handle the highlight modifier being updated
     */
    function handleHighlightModifierUpdate(value: string) {
        if (isNaN(Number(value))) {
            alert("Highlight modifier must be a number");
            return;
        }

        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    highlightModifier: Number(value)
                }
            }
        });
    }

    /**
     * Handle the icon being updated
     */
    function handleIconUpdate(icon: HoloUIIcon) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    icon
                }
            }
        });
    }

    /**
     * Handle the actions being updated
     *
     * @param actions The new actions
     */
    function handleActionsUpdate(actions: HoloUIAction[]) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    actions
                }
            }
        });
    }

    function validateComponent(component: HoloUIComponent | undefined) {
        const data = component?.data as HoloUIButtonData;
        const icon = data.icon;
        if (icon.type === 'text' && (icon as HoloUITextIcon).text === '') {
            return 'Please fill in the icon text!';
        }

        if (icon.type === 'item' && (icon as HoloUIItemIcon).item === '') {
            return 'Please fill in the item ID!';
        }

        if (icon.type === 'textImage' && (icon as HoloUITextImageIcon).path === '') {
            return 'Please select an image!';
        }

        if (data.actions.length === 0) {
            return 'Please add at least one action!';
        }

        // Validate actions
        for (const action of data.actions) {
            const type = action.type;
            if (type === "command") {
                const commandAction = action as HoloUICommandAction;
                if (commandAction.command === "") {
                    return 'Please fill in the command!';
                }

                continue;
            }

            if (type === "sound") {
                const soundAction = action as HoloUISoundAction;
                if (soundAction.sound === "") {
                    return 'Please fill in the sound!';
                }

                continue;
            }
        }

        return undefined;
    }

    /**
     * Handle the save button being clicked
     */
    function handleSave() {
        console.log(`Saving component: ${JSON.stringify(component)}`);
        // Ensure the ID is not empty
        if (component?.id === '') {
            alert('Component ID cannot be empty!');
            return;
        }

        // Ensure the ID is not already taken
        // if (data?.components.find((comp) => comp.id === component?.id)) {
        //     alert('Component with ID already exists!');
        //     return;
        // }

        // Validate the component using the provided function
        const validate = validateComponent(component);
        if (validate) {
            alert(validate);
            return;
        }

        setData((prevState) => {
            if (!prevState) {
                return prevState;
            }

            // Remove the old component
            prevState.components = prevState.components.filter((comp) => comp.id !== component?.id);

            // Add the new component
            return {
                ...prevState,
                // components: [
                //     ...prevState.components,
                //     component
                // ]
            };
        });
    }

    return (
        <div className={styles.content}>
            <Row>
                <Column
                    xs={24}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="component-id">
                            ID
                        </label>
                        <input
                            id="component-id"
                            name="component-id"
                            type="text"
                            defaultValue={component.id}
                            onBlur={handleIDChange}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >

                    <div className={styles.inputGroup}>
                        <label htmlFor="component-x">
                            X
                        </label>
                        <input
                            id="component-x"
                            name="component-x"
                            type="number"
                            value={component.offset[0]}
                            onChange={(e) => handleOffsetChange(e, 0)}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >

                    <div className={styles.inputGroup}>
                        <label htmlFor="component-y">
                            Y
                        </label>
                        <input
                            id="component-y"
                            name="component-y"
                            type="number"
                            value={component.offset[1]}
                            onChange={(e) => handleOffsetChange(e, 1)}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="component-z">
                            Z
                        </label>
                        <input
                            id="component-z"
                            name="component-z"
                            type="number"
                            value={component.offset[2]}
                            onChange={(e) => handleOffsetChange(e, 2)}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="highlight-modifier">
                            Highlight Modifier
                        </label>
                        <input
                            id="highlight-modifier"
                            name="highlight-modifier"
                            type="number"
                            value={(component.data as HoloUIButtonData).highlightModifier}
                            onChange={(e) => handleHighlightModifierUpdate(e.target.value)}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="icon-modifier">
                            Icon
                        </label>
                        <IconEditor
                            currentIcon={(component.data as HoloUIButtonData).icon}
                            onUpdate={handleIconUpdate}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="actions-modifier">
                            Actions
                        </label>
                        <ActionList
                            actions={(component.data as HoloUIButtonData).actions}
                            setActions={(actions) => handleActionsUpdate(actions)}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                >
                    <button
                        className={styles.editButton}
                        onClick={() => handleEditComponent()}
                    >
                        Edit Component
                    </button>
                </Column>
                {/* <Column
                    xs={24}
                >
                    <div onClick={handleSave} className={styles.saveButton}>
                        <BiSave/>
                        Save Changes
                    </div>
                </Column> */}
            </Row>
        </div>
    )
}