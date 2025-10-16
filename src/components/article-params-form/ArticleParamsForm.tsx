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
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	initialState: ArticleStateType;
	defaults: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	initialState,
	defaults,
	onApply,
}: ArticleParamsFormProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(initialState);
	const asideRef = useRef<HTMLElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setFormState(initialState);
	}, [initialState]);

	const handleToggle = () => setIsMenuOpen((v) => !v);

	const handleOutsideClick = (e: MouseEvent) => {
		if (!isMenuOpen) return;
		const target = e.target as Node;
		// Закрываем, если клик вне корневого контейнера (который включает стрелку и aside)
		if (rootRef.current && !rootRef.current.contains(target)) {
			setIsMenuOpen(false);
		}
	};

	useEffect(() => {
		if (!isMenuOpen) return;
		document.addEventListener('click', handleOutsideClick);
		return () => document.removeEventListener('click', handleOutsideClick);
	}, [isMenuOpen]);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		onApply(formState);
		setIsMenuOpen(false);
	};

	const handleReset: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		setFormState(defaults);
		onApply(defaults);
		setIsMenuOpen(false);
	};

	return (
		<div ref={rootRef}>
			<ArrowButton isOpen={isMenuOpen} onClick={handleToggle} />
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}
				onClick={(e) => e.stopPropagation()}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<div className={styles.header}>
						<Text weight={800} size={22} uppercase>
							Задайте параметры
						</Text>
					</div>
					<div className={styles.fields}>
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
							onChange={(opt) =>
								setFormState((s) => ({ ...s, fontColor: opt }))
							}
						/>
						<div className={styles.separator}>
							<Separator />
						</div>

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
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
