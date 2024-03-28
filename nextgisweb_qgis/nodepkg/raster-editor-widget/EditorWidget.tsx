import { observer } from "mobx-react-lite";
import { useMemo } from "react";

import { Select } from "@nextgisweb/gui/antd";
import { gettext } from "@nextgisweb/pyramid/i18n";
import type {
    EditorWidgetComponent,
    EditorWidgetProps,
} from "@nextgisweb/resource/type";

import type { EditorStore, Mode } from "./EditorStore";
import { CopyModeComponent } from "./component/CopyModeComponent";
import { FileModeComponent } from "./component/FileModeComponent";
import { SldModeComponent } from "./component/SldModeComponent";

import "./EditorWidget.less";

type SelectProps = Parameters<typeof Select>[0];
type Option = NonNullable<SelectProps["options"]>[0] & {
    value: Mode;
};

export const EditorWidget: EditorWidgetComponent<
    EditorWidgetProps<EditorStore>
> = observer(({ store }: EditorWidgetProps<EditorStore>) => {
    const { mode } = store;
    const modeOpts = useMemo(() => {
        const result: Option[] = [
            { value: "file", label: gettext("Style from file") },
            { value: "sld", label: gettext("User-defined style") },
            { value: "default", label: gettext("Default style") },
            { value: "copy", label: gettext("Copy from resource") },
        ];
        return result;
    }, []);

    const modeComponent = useMemo(() => {
        switch (mode) {
            case "file":
                return <FileModeComponent store={store} />;
            case "sld":
                return <SldModeComponent store={store} />;
            case "copy":
                return <CopyModeComponent store={store} />;
            default:
                <>Default</>;
        }
    }, [store, mode]);

    return (
        <div className="ngw-qgis-raster-editor-widget">
            <Select
                className="mode"
                options={modeOpts}
                value={store.mode}
                onChange={store.setMode}
            />
            {modeComponent}
        </div>
    );
});

EditorWidget.title = gettext("QGIS style");
EditorWidget.activateOn = { create: true };
EditorWidget.order = -50;
