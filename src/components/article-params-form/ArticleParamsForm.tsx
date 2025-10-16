import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import type { ArticleStateType } from 'src/constants/articleProps';
import {
    fontFamilyOptions,
    fontColors,
    backgroundColors,
    contentWidthArr,
    fontSizeOptions,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
    initialState: ArticleStateType;
    defaults: ArticleStateType;
    onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ initialState, defaults, onApply }: ArticleParamsFormProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [formState, setFormState] = useState<ArticleStateType>(initialState);
    const asideRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setFormState(initialState);
    }, [initialState]);

    const handleToggle = () => setIsOpen((v) => !v);

    const handleOutsideClick = (e: MouseEvent) => {
        if (!isOpen) return;
        const target = e.target as Node;
        if (asideRef.current && !asideRef.current.contains(target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isOpen]);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        onApply(formState);
        setIsOpen(false);
    };

    const handleReset: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setFormState(defaults);
        onApply(defaults);
        setIsOpen(false);
    };

    return (
        <>
            <ArrowButton isOpen={isOpen} onClick={handleToggle} />
            <aside ref={asideRef} className={clsx(styles.container, { [styles.container_open]: isOpen })}>
                <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
                    <Select
                        title='Шрифт'
                        placeholder='Выберите шрифт'
                        options={fontFamilyOptions}
                        selected={formState.fontFamilyOption}
                        onChange={(opt) =>
                            setFormState((s) => ({ ...s, fontFamilyOption: opt }))
                        }
                    />

                    <RadioGroup
                        title='Размер шрифта'
                        name='font-size'
                        options={fontSizeOptions}
                        selected={formState.fontSizeOption}
                        onChange={(opt) =>
                            setFormState((s) => ({ ...s, fontSizeOption: opt }))
                        }
                    />

                    <Select
                        title='Цвет шрифта'
                        placeholder='Выберите цвет'
                        options={fontColors}
                        selected={formState.fontColor}
                        onChange={(opt) => setFormState((s) => ({ ...s, fontColor: opt }))}
                    />

                    <Select
                        title='Цвет фона'
                        placeholder='Выберите цвет фона'
                        options={backgroundColors}
                        selected={formState.backgroundColor}
                        onChange={(opt) =>
                            setFormState((s) => ({ ...s, backgroundColor: opt }))
                        }
                    />

                    <Select
                        title='Ширина контента'
                        placeholder='Выберите ширину'
                        options={contentWidthArr}
                        selected={formState.contentWidth}
                        onChange={(opt) =>
                            setFormState((s) => ({ ...s, contentWidth: opt }))
                        }
                    />
                    <div className={styles.bottomContainer}>
                        <Button title='Сбросить' htmlType='reset' type='clear' />
                        <Button title='Применить' htmlType='submit' type='apply' />
                    </div>
                </form>
            </aside>
        </>
    );
};
