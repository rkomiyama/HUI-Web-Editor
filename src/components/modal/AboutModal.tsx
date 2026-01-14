import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import {AiFillGithub} from "react-icons/ai";
import {BsCurrencyDollar, BsDiscord} from "react-icons/bs";
import {BiBook} from "react-icons/bi";
import styles from "@/styles/components/modal/AboutModal.module.scss";

export default function AboutModal() {
    /**
     * Opens a link in the default browser.
     *
     * @param url The url to open
     */
    function openLink(url: string) {
        window.open(url, "_blank");
    }

    return (
        <div className={styles.content}>
            <div className={styles.title}>
                <h1>HoloUI Builder</h1>
                <h3>
                    &copy; {new Date().getFullYear()} Volmit Software, All Rights Reserved.
                </h3>
            </div>
            <div className={styles.buttons}>
                <Row center>
                    <Column xs={24} lg={12}>
                        <div
                            className={styles.button}
                            onClick={() => openLink("https://github.com/Studio-Archetype/HUI-Builder")}
                        >
                            <AiFillGithub/>
                            GitHub
                        </div>
                    </Column>
                </Row>
                <Row center>
                    <Column xs={24} lg={12}>
                        <div
                            className={styles.button}
                            onClick={() => openLink("https://discord.studioarchetype.net/")}
                        >
                            <BsDiscord/>
                            Discord
                        </div>
                    </Column>
                </Row>
                <Row center>
                    <Column xs={24} lg={12}>
                        <div
                            className={styles.button}
                            onClick={() => openLink("https://docs.volmit.com/hologui")}
                        >
                            <BiBook/>
                            Documentation
                        </div>
                    </Column>
                </Row>
                <Row center>
                    <Column xs={24} lg={12}>
                        <div
                            className={styles.button}
                            onClick={() => openLink("https://www.volmit.com/software/hologui")}
                        >
                            <BsCurrencyDollar/>
                            Purchase
                        </div>
                        <Row center>
                            <Column xs={12} lg={6}>
                                <div
                                    className={styles.button}
                                    onClick={() => openLink("https://www.volmit.com/software/hologui")}
                                >
                                    Polymart
                                </div>
                            </Column>
                            <Column xs={12} lg={6}>
                                <div
                                    className={styles.button}
                                    onClick={() => openLink("https://www.volmit.com/software/hologui")}
                                >
                                    Spigot
                                </div>
                            </Column>
                            <Column xs={12} lg={6}>
                                <div
                                    className={styles.button}
                                    onClick={() => openLink("https://www.volmit.com/software/hologui")}
                                >
                                    BuiltByBit
                                </div>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </div>
        </div>
    )
}